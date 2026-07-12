"use client";

import * as React from "react";
import {
  Award,
  BriefcaseBusiness,
  Code2,
  FolderGit2,
  GraduationCap,
} from "lucide-react";
import experiences from "@/data/experiences.json";
import {
  CareerEntry,
  CareerTrack,
  CareerType,
  formatCareerRange,
  mainTrackColor,
  parseCareerData,
} from "@/lib/career";

const career = parseCareerData(experiences);
const careerRows = career.entries.reduce<CareerEntry[][]>((rows, entry) => {
  const rangeEnd =
    entry.endDate === null ? "present" : (entry.endDate ?? "milestone");
  const rangeKey = `${entry.startDate}:${rangeEnd}`;
  const matchingRow = rows.find(
    ([candidate]) => {
      const candidateEnd =
        candidate.endDate === null
          ? "present"
          : (candidate.endDate ?? "milestone");
      return `${candidate.startDate}:${candidateEnd}` === rangeKey;
    },
  );

  if (matchingRow) matchingRow.push(entry);
  else rows.push([entry]);
  return rows;
}, []);

const typeMeta: Record<
  CareerType,
  { icon: React.ComponentType<{ className?: string }> }
> = {
  education: { icon: GraduationCap },
  internship: { icon: Code2 },
  work: { icon: BriefcaseBusiness },
  project: { icon: FolderGit2 },
  milestone: { icon: Award },
};

interface GraphNode {
  x: number;
  y: number;
  track: string;
}

interface GraphMeasurements {
  width: number;
  height: number;
  nodes: Record<string, GraphNode>;
}

function CareerGraph({
  measurements,
  tracks,
}: {
  measurements: GraphMeasurements;
  tracks: Map<string, CareerTrack>;
}) {
  if (Object.keys(measurements.nodes).length === 0) return null;

  const nodesByTrack = new Map<string, GraphNode[]>();
  for (const node of Object.values(measurements.nodes)) {
    const nodes = nodesByTrack.get(node.track) ?? [];
    nodes.push(node);
    nodesByTrack.set(node.track, nodes);
  }
  for (const nodes of nodesByTrack.values()) {
    nodes.sort((a, b) => a.y - b.y);
  }

  const mainNodes = nodesByTrack.get("main") ?? [];
  const mainX = mainNodes[0]?.x ?? 0;
  const mainTop = tracks.get("main")?.ongoing ? 4 : (mainNodes[0]?.y ?? 0);
  const mainBottom = mainNodes.at(-1)?.y ?? measurements.height;

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-visible"
      width={measurements.width}
      height={measurements.height}
      viewBox={`0 0 ${measurements.width} ${measurements.height}`}
      fill="none"
    >
      {mainNodes.length > 0 && (
        <path
          d={`M ${mainX} ${mainTop} L ${mainX} ${mainBottom}`}
          stroke={mainTrackColor}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.72"
        />
      )}

      {[...tracks.values()]
        .filter((track) => track.id !== "main")
        .map((track) => {
          const nodes = nodesByTrack.get(track.id) ?? [];
          if (nodes.length === 0) return null;

          const parentNodes = nodesByTrack.get(track.parentTrack ?? "main") ?? mainNodes;
          const parentX = parentNodes[0]?.x ?? mainX;
          const branchX = nodes[0].x;
          const firstNode = nodes[0];
          const lastNode = nodes.at(-1)!;
          const parentAbove = parentNodes
            .filter((node) => node.y < firstNode.y)
            .at(-1);
          const parentBelow = parentNodes.find((node) => node.y > lastNode.y);
          const top = track.ongoing
            ? 4
            : parentAbove
              ? (parentAbove.y + firstNode.y) / 2
              : Math.max(8, firstNode.y - 96);
          const bottom = parentBelow
            ? (lastNode.y + parentBelow.y) / 2
            : Math.min(measurements.height - 4, lastNode.y + 96);
          const curve = Math.min(44, Math.max(24, (bottom - top) / 5));
          const path = track.ongoing
            ? `M ${parentX} ${bottom} C ${parentX} ${bottom - curve}, ${branchX} ${bottom - curve}, ${branchX} ${bottom - curve * 2} L ${branchX} ${top}`
            : `M ${parentX} ${bottom} C ${parentX} ${bottom - curve}, ${branchX} ${bottom - curve}, ${branchX} ${bottom - curve * 2} L ${branchX} ${top + curve * 2} C ${branchX} ${top + curve}, ${parentX} ${top + curve}, ${parentX} ${top}`;

          return (
            <path
              key={track.id}
              d={path}
              stroke={track.color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.78"
            />
          );
        })}
    </svg>
  );
}

function CareerCard({ entry, color }: { entry: CareerEntry; color: string }) {
  const meta = typeMeta[entry.type];
  const Icon = meta.icon;
  const dateLabel = formatCareerRange(entry);

  return (
    <article
      className="career-card group"
      style={{ "--career-color": color } as React.CSSProperties}
    >
      <div className="flex flex-wrap items-center gap-2 md:hidden">
        <time
          dateTime={entry.startDate}
          className="text-xs font-medium tracking-wide text-muted-foreground"
        >
          {dateLabel}
        </time>
      </div>

      <div className="flex items-start gap-4">
        <div
          className="mt-0.5 flex h-10 w-10 flex-none items-center justify-center rounded-xl border"
          style={{
            color,
            borderColor: `${color}38`,
            backgroundColor: `${color}12`,
          }}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2">
            <div>
              <h3 className="text-base font-semibold leading-snug text-card-foreground sm:text-lg">
                {entry.title}
              </h3>
              <p className="mt-1 text-sm font-medium text-primary">
                {entry.organization}
              </p>
            </div>
          </div>

          <p className="text-sm leading-6 text-muted-foreground">
            {entry.description}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function CareerTimeline() {
  const listRef = React.useRef<HTMLOListElement | null>(null);
  const nodeRefs = React.useRef<Record<string, HTMLSpanElement | null>>({});
  const [measurements, setMeasurements] = React.useState<GraphMeasurements>({
    width: 0,
    height: 0,
    nodes: {},
  });

  React.useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    let frameId: number | null = null;
    const measure = () => {
      frameId = null;
      const listRect = list.getBoundingClientRect();
      const nodes: Record<string, GraphNode> = {};

      for (const entry of career.entries) {
        const element = nodeRefs.current[entry.id];
        if (!element) continue;
        const rect = element.getBoundingClientRect();
        nodes[entry.id] = {
          x: rect.left - listRect.left + rect.width / 2,
          y: rect.top - listRect.top + rect.height / 2,
          track: entry.track,
        };
      }

      setMeasurements({
        width: listRect.width,
        height: listRect.height,
        nodes,
      });
    };
    const scheduleMeasure = () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(measure);
    };

    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(list);
    for (const node of Object.values(nodeRefs.current)) {
      if (node) observer.observe(node);
    }
    scheduleMeasure();

    return () => {
      observer.disconnect();
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <section className="px-1 py-16 sm:px-4 sm:py-24" aria-labelledby="career-heading">
      <div className="mx-auto mb-14 max-w-2xl text-center sm:mb-20">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          <FolderGit2 className="h-3.5 w-3.5" />
          git log --career
        </div>
        <h2 id="career-heading" className="section-heading mb-4">
          Career <span className="gradient-text">History</span>
        </h2>
        <p className="mx-auto max-w-xl leading-relaxed text-muted-foreground">
          My academic path and the experiences branching alongside it.
        </p>
      </div>

      <ol
        ref={listRef}
        className="relative mx-auto max-w-5xl space-y-8 sm:space-y-10"
      >
        <CareerGraph measurements={measurements} tracks={career.tracks} />

        {careerRows.map((row) => {
          const representative = row[0];
          const dateLabel = formatCareerRange(representative);
          return (
            <li
              key={row.map((entry) => entry.id).join(":")}
              className="career-row relative z-10"
            >
              <time
                dateTime={representative.startDate}
                className="career-date hidden pt-5 text-sm font-medium tracking-wide text-muted-foreground md:block"
              >
                {dateLabel}
              </time>

              <div className="career-graph-cell relative min-h-12">
                {row.map((entry) => {
                  const track = career.tracks.get(entry.track)!;
                  const laneStyle = {
                    "--career-lane": track.lane,
                    "--career-lane-count": Math.max(1, career.maxLane),
                  } as React.CSSProperties;

                  return (
                    <React.Fragment key={entry.id}>
                      <span
                        aria-hidden="true"
                        className="career-node-connector absolute top-6 z-10 h-px"
                        style={{ ...laneStyle, backgroundColor: track.color }}
                      />
                      <span
                        ref={(node) => {
                          nodeRefs.current[entry.id] = node;
                        }}
                        aria-hidden="true"
                        className="career-node absolute top-6 z-20 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-background shadow-[0_0_0_4px_hsl(var(--background)),0_0_18px_currentColor]"
                        style={{
                          ...laneStyle,
                          color: track.color,
                          backgroundColor: track.color,
                        }}
                      />
                    </React.Fragment>
                  );
                })}
              </div>

              <div className="career-content-grid">
                {row.map((entry) => {
                  const track = career.tracks.get(entry.track)!;
                  return (
                    <CareerCard
                      key={entry.id}
                      entry={entry}
                      color={track.color}
                    />
                  );
                })}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
