import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();
crons.interval("purge stale presence and reactions", { seconds: 15 }, internal.presence.purge);
export default crons;
