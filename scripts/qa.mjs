import fs from "node:fs";
import assert from "node:assert/strict";

const html=fs.readFileSync("index.html","utf8");
const css=fs.readFileSync("style.css","utf8");
const app=fs.readFileSync("app.js","utf8");

assert.match(html,/id="video-file"/);
assert.match(html,/id="vod-player"/);
assert.match(html,/id="note-form"/);
assert.match(html,/id="timeline-list"/);
assert.match(html,/id="export-button"/);
assert.match(html,/id="import-button"/);
assert.match(css,/@media\(max-width:680px\)/);
assert.match(css,/focus-visible/);
assert.match(app,/URL\.createObjectURL/);
assert.match(app,/parseTime/);
assert.match(app,/localStorage/);
assert.match(app,/downloadJson/);
assert.match(app,/importJson/);
assert.ok(fs.existsSync("sobre.html"));
assert.ok(fs.existsSync("privacidade.html"));
assert.ok(fs.existsSync("termos.html"));

console.log("OW VOD Timeline static QA passed");