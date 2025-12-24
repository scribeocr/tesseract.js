/**
 * Decompresses gzip data using native browser DecompressionStream API
 * @param {Uint8Array} data - The gzipped data to decompress
 * @returns {Promise<Uint8Array>} The decompressed data
 */
async function gunzip(data) {
  const ds = new DecompressionStream('gzip');
  const blob = new Blob([data]);
  const decompressedStream = blob.stream().pipeThrough(ds);
  const decompressedBlob = await new Response(decompressedStream).blob();
  const arrayBuffer = await decompressedBlob.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

export default gunzip;
