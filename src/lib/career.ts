export const careerTypes = [
  "education",
  "volunteering",
  "internship",
  "job",
  "freelance",
] as const;

export type CareerType = (typeof careerTypes)[number];

export interface CareerEntry {
  id: string;
  title: string;
  organization: string;
  description: string;
  type: CareerType;
  startDate: string;
  endDate?: string | null;
  track: string;
}

export interface CareerTrack {
  id: string;
  parentTrack: string | null;
  lane: number;
  color: string;
  startValue: number;
  endValue: number;
  ongoing: boolean;
}

export interface CareerLayout {
  entries: CareerEntry[];
  tracks: Map<string, CareerTrack>;
  maxLane: number;
}

const branchColors = ["#06b6d4", "#10b981", "#f59e0b", "#f43f5e"];
export const mainTrackColor = "#8b5cf6";
const monthPattern = /^\d{4}-(0[1-9]|1[0-2])$/;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(
  record: Record<string, unknown>,
  key: string,
  context: string,
) {
  const value = record[key];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${context}: "${key}" must be a non-empty string.`);
  }
  return value.trim();
}

export function dateValue(value: string) {
  if (!monthPattern.test(value)) {
    throw new Error(`Invalid career date "${value}". Use YYYY-MM.`);
  }
  const [year, month] = value.split("-").map(Number);
  return year * 12 + month - 1;
}

function parseEntry(value: unknown, index: number): CareerEntry {
  const context = `Career entry at index ${index}`;
  if (!isObject(value)) {
    throw new Error(`${context} must be an object.`);
  }

  const type = requiredString(value, "type", context);
  if (!careerTypes.includes(type as CareerType)) {
    throw new Error(
      `${context}: unsupported type "${type}". Use ${careerTypes.join(", ")}.`,
    );
  }

  const startDate = requiredString(value, "startDate", context);
  dateValue(startDate);

  const endDateValue = value.endDate;
  if (
    endDateValue !== undefined &&
    endDateValue !== null &&
    typeof endDateValue !== "string"
  ) {
    throw new Error(`${context}: "endDate" must be YYYY-MM, null, or omitted.`);
  }
  if (typeof endDateValue === "string") {
    dateValue(endDateValue);
    if (dateValue(endDateValue) < dateValue(startDate)) {
      throw new Error(`${context}: "endDate" cannot be before "startDate".`);
    }
  }

  const endDate: string | null | undefined =
    typeof endDateValue === "string" || endDateValue === null
      ? endDateValue
      : undefined;

  const track = requiredString(value, "track", context);
  if (value.parentTrack !== undefined) {
    throw new Error(
      `${context}: "parentTrack" is no longer needed; every branch automatically merges into "main".`,
    );
  }

  return {
    id: requiredString(value, "id", context),
    title: requiredString(value, "title", context),
    organization: requiredString(value, "organization", context),
    description: requiredString(value, "description", context),
    type: type as CareerType,
    startDate,
    ...(endDate !== undefined ? { endDate } : {}),
    track,
  };
}

function rangesOverlap(a: CareerTrack, b: CareerTrack) {
  return a.startValue <= b.endValue && b.startValue <= a.endValue;
}

export function parseCareerData(raw: unknown): CareerLayout {
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new Error("Career data must be a non-empty array.");
  }

  const entries = raw.map(parseEntry);
  const ids = new Set<string>();
  for (const entry of entries) {
    if (ids.has(entry.id)) {
      throw new Error(`Duplicate career entry id "${entry.id}".`);
    }
    ids.add(entry.id);
  }

  const grouped = new Map<string, CareerEntry[]>();
  for (const entry of entries) {
    const group = grouped.get(entry.track) ?? [];
    group.push(entry);
    grouped.set(entry.track, group);
  }
  if (!grouped.has("main")) {
    throw new Error('Career data requires a "main" track.');
  }

  const tracks = new Map<string, CareerTrack>();
  for (const [trackId, trackEntries] of grouped) {
    const ongoing = trackEntries.some((entry) => entry.endDate === null);
    const finiteEnds = trackEntries.map((entry) =>
      entry.endDate === undefined ? dateValue(entry.startDate) : entry.endDate === null
        ? Number.POSITIVE_INFINITY
        : dateValue(entry.endDate),
    );

    tracks.set(trackId, {
      id: trackId,
      parentTrack: trackId === "main" ? null : "main",
      lane: trackId === "main" ? 0 : -1,
      color: trackId === "main" ? mainTrackColor : "",
      startValue: Math.min(...trackEntries.map((entry) => dateValue(entry.startDate))),
      endValue: Math.max(...finiteEnds),
      ongoing,
    });
  }

  const branches = [...tracks.values()]
    .filter((track) => track.id !== "main")
    .sort(
      (a, b) =>
        a.startValue - b.startValue ||
        a.endValue - b.endValue ||
        a.id.localeCompare(b.id),
    );
  const lanes: CareerTrack[][] = [];
  for (const track of branches) {
    const parent = tracks.get(track.parentTrack!);
    if (
      parent &&
      (track.startValue < parent.startValue || track.endValue > parent.endValue)
    ) {
      throw new Error(
        `Track "${track.id}" must fit within parent track "${parent.id}".`,
      );
    }

    let laneIndex = lanes.findIndex((lane) =>
      lane.every((existing) => !rangesOverlap(existing, track)),
    );
    if (laneIndex === -1) {
      laneIndex = lanes.length;
      lanes.push([]);
    }
    lanes[laneIndex].push(track);
    track.lane = laneIndex + 1;
    track.color = branchColors[laneIndex % branchColors.length];
  }

  const sortedEntries = [...entries].sort((a, b) => {
    const aEnd = a.endDate === null ? Number.POSITIVE_INFINITY : dateValue(a.endDate ?? a.startDate);
    const bEnd = b.endDate === null ? Number.POSITIVE_INFINITY : dateValue(b.endDate ?? b.startDate);
    return (
      bEnd - aEnd ||
      dateValue(b.startDate) - dateValue(a.startDate) ||
      a.id.localeCompare(b.id)
    );
  });

  return { entries: sortedEntries, tracks, maxLane: lanes.length };
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatCareerDate(value: string) {
  const [year, month] = value.split("-").map(Number);
  return dateFormatter.format(new Date(Date.UTC(year, month - 1, 1)));
}

export function formatCareerRange(entry: CareerEntry) {
  const start = formatCareerDate(entry.startDate);
  if (entry.endDate === undefined) return start;
  const end = entry.endDate === null ? "Present" : formatCareerDate(entry.endDate!);
  return `${start} – ${end}`;
}
