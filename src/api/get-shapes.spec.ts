import server from "../__mocks__/server";

import getShapes from "./get-shapes";

test("adds 1 + 2 to equal 3", async () => {
  const shapes = await getShapes();
  expect(shapes).toBe(3);
});

// server.close(function() {
//   console.log("closed");
// });
