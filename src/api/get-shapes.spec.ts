
import getShapes from "./get-shapes";

test("Passing a URL to a WAV returns the location of the mouth shape analysis and location of the downloaded WAV file.", async () => {
  const request = "http://127.0.0.1:3000/process.wav";
  const shapes = await getShapes(request);
  expect(shapes.audioFileName).toMatch("/tmp/tmp-");
  expect(shapes.audioFileName).toMatch(".wav");
  expect(shapes.shapesFileName).toMatch("/tmp/tmp-");
  expect(shapes.shapesFileName).toMatch(".txt");
});
