import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("inbound email storage does not trigger automatic AI draft replies", () => {
	const files = ["workers/index.ts", "workers/agent/index.ts"];

	for (const file of files) {
		const source = read(file);
		assert.equal(source.includes("/onNewEmail"), false, file);
		assert.equal(source.includes("Auto-draft trigger failed"), false, file);
	}
});

test("outbound email paths do not enforce per-mailbox send rate limits", () => {
	const files = [
		"workers/index.ts",
		"workers/routes/reply-forward.ts",
		"workers/lib/tools.ts",
		"workers/durableObject/index.ts",
	];

	for (const file of files) {
		assert.equal(read(file).includes("checkSendRateLimit"), false, file);
	}
});
