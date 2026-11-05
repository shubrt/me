import { describe, expect, it } from "vite-plus/test";

import { createInitialState, menuList, reduce } from "@shubrt/session";
import { makeData, rngOf } from "./helpers.ts";

const data = makeData(rngOf(0.5));

describe("menuList", () => {
  it("filters commands by the typed slash prefix", () => {
    let state = createInitialState(data, { rng: rngOf(0.5) });
    state = reduce(state, { type: "input", value: "/pro", caret: 4 });
    expect(menuList(state, data).map((c) => c.name)).toEqual(["/projects"]);
  });

  it("shows every command for a bare slash", () => {
    let state = createInitialState(data, { rng: rngOf(0.5) });
    state = reduce(state, { type: "input", value: "/", caret: 1 });
    expect(menuList(state, data)).toHaveLength(3);
  });

  it("stays empty while dismissed", () => {
    let state = createInitialState(data, { rng: rngOf(0.5) });
    state = reduce(state, { type: "input", value: "/pro", caret: 4 });
    state = reduce(state, { type: "menuDismiss" });
    expect(menuList(state, data)).toEqual([]);
  });
});
