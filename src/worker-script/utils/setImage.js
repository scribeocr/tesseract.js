/**
 * setImage
 *
 * @name setImage
 * @function set image in tesseract for recognition
 * @access public
 */
export default (TessModule, api, image, angle = 0, upscale = false) => {
  const exif = parseInt(image.slice(0, 500).join(' ').match(/1 18 0 3 0 0 0 1 0 (\d)/)?.[1], 10) || 1;

  TessModule.FS.writeFile('/input', image);

  const res = api.SetImageFile(exif, angle, upscale);
  if (res === 1) throw Error('Error attempting to read image.');
};
