
import getShapes from "./get-shapes";

test("Passing a URL (of a WAV) returns the location of the mouth shape analysis and location of the downloaded WAV file.", async () => {
  const request = "http://127.0.0.1:3000/process.wav";
  const shapes = await getShapes(request);
  expect(shapes.valid).toBeTruthy();
  expect(shapes.audioFileName).toMatch("/tmp/voice_");
  expect(shapes.audioFileName).toMatch(".wav");
  expect(shapes.shapesFileName).toMatch("/tmp/shapes_");
  expect(shapes.shapesFileName).toMatch(".txt");
  expect(shapes.shapesID).toMatch("shapes_");
  expect(shapes.shapesID).not.toMatch("/tmp/shapes_");
  expect(shapes.shapesID).not.toMatch(".txt");
});

test("Passing an invalid URL returns shapes.valid=false.", async () => {
  const request = "http1270013000/process.wav";
  const shapes = await getShapes(request);
  expect(shapes.valid).toBeFalsy();
});

test("Passing a not found URL returns shapes.valid=false.", async () => {
  const request = "http://127.0.0.1:3000/aintnosuchfile.wav";
  const shapes = await getShapes(request);
  expect(shapes.valid).toBeFalsy();
});

test("Passing a URL that is not a WAV returns shapes.valid=false.", async () => {
  const request = "http://127.0.0.1:3000/invalid.wav";
  const shapes = await getShapes(request);
  expect(shapes.valid).toBeFalsy();
});
