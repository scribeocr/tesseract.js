/**
 * @typedef {Object} Lang
 * @property {string} code
 * @property {unknown} data
 */

/**
 * @typedef {Object} InitOptions
 * @property {string} load_system_dawg
 * @property {string} load_freq_dawg
 * @property {string} load_unambig_dawg
 * @property {string} load_punc_dawg
 * @property {string} load_number_dawg
 * @property {string} load_bigram_dawg
 */

/**
 * @typedef {Object} LoggerMessage
 * @property {string} jobId
 * @property {number} progress
 * @property {string} status
 * @property {string} userJobId
 * @property {string} workerId
 */

/**
 * @typedef {'0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' |
 * '9' | '10' | '11' | '12' | '13'} PSM
 */

/**
 * @typedef {Object} WorkerParams
 * @property {PSM} tessedit_pageseg_mode
 * @property {string} tessedit_char_whitelist
 * @property {string} tessedit_char_blacklist
 * @property {string} preserve_interword_spaces
 * @property {string} user_defined_dpi
 * @property {*} [propName]
 */

/**
 * @typedef {Object} OutputFormats
 * @property {boolean} text
 * @property {boolean} blocks
 * @property {boolean} layoutBlocks
 * @property {boolean} hocr
 * @property {boolean} tsv
 * @property {boolean} box
 * @property {boolean} unlv
 * @property {boolean} osd
 * @property {boolean} pdf
 * @property {boolean} imageColor
 * @property {boolean} imageGrey
 * @property {boolean} imageBinary
 * @property {boolean} debug
 */

/**
 * @typedef {Object} RecognizeOptions
 * @property {Rectangle} rectangle
 * @property {string} pdfTitle
 * @property {boolean} pdfTextOnly
 * @property {boolean} rotateAuto
 * @property {number} rotateRadians
 */

/**
 * @typedef {Object} ConfigResult
 * @property {string} jobId
 * @property {*} data
 */

/**
 * @typedef {Object} RecognizeResult
 * @property {string} jobId
 * @property {Page} data
 */

/**
 * @typedef {Object} DetectResult
 * @property {string} jobId
 * @property {DetectData} data
 */

/**
 * @typedef {Object} DetectData
 * @property {number|null} tesseract_script_id
 * @property {string|null} script
 * @property {number|null} script_confidence
 * @property {number|null} orientation_degrees
 * @property {number|null} orientation_confidence
 */

/**
 * @typedef {Object} Rectangle
 * @property {number} left
 * @property {number} top
 * @property {number} width
 * @property {number} height
 */

/**
 * @typedef {string|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement|ArrayBuffer|
 * CanvasRenderingContext2D|File|Blob|ImageData|Buffer|OffscreenCanvas} ImageLike
 */

/**
 * @typedef {Object} Baseline
 * @property {number} x0
 * @property {number} y0
 * @property {number} x1
 * @property {number} y1
 * @property {boolean} has_baseline
 */

/**
 * @typedef {Object} RowAttributes
 * @property {number} ascenders
 * @property {number} descenders
 * @property {number} rowHeight
 */

/**
 * @typedef {Object} Bbox
 * @property {number} x0
 * @property {number} y0
 * @property {number} x1
 * @property {number} y1
 */

/**
 * @typedef {Object} Choice
 * @property {string} text
 * @property {number} confidence
 */

/**
 * @typedef {Object} TessSymbol
 * @property {Choice[]} choices
 * @property {*} image
 * @property {string} text
 * @property {number} confidence
 * @property {Baseline} baseline
 * @property {Bbox} bbox
 * @property {boolean} is_superscript
 * @property {boolean} is_subscript
 * @property {boolean} is_dropcap
 * @property {Word} word
 * @property {Line} line
 * @property {Paragraph} paragraph
 * @property {Block} block
 * @property {Page} page
 */

/**
 * @typedef {Object} Word
 * @property {TessSymbol[]} symbols
 * @property {Choice[]} choices
 * @property {string} text
 * @property {number} confidence
 * @property {Baseline} baseline
 * @property {Bbox} bbox
 * @property {boolean} is_numeric
 * @property {boolean} in_dictionary
 * @property {string} direction
 * @property {string} language
 * @property {boolean} is_bold
 * @property {boolean} is_italic
 * @property {boolean} is_underlined
 * @property {boolean} is_monospace
 * @property {boolean} is_serif
 * @property {boolean} is_smallcaps
 * @property {number} font_size
 * @property {number} font_id
 * @property {string} font_name
 * @property {Line} line
 * @property {Paragraph} paragraph
 * @property {Block} block
 * @property {Page} page
 */

/**
 * @typedef {Object} Line
 * @property {Word[]} words
 * @property {string} text
 * @property {number} confidence
 * @property {Baseline} baseline
 * @property {RowAttributes} rowAttributes
 * @property {Bbox} bbox
 * @property {Paragraph} paragraph
 * @property {Block} block
 * @property {Page} page
 * @property {TessSymbol[]} symbols
 */

/**
 * @typedef {Object} Paragraph
 * @property {Line[]} lines
 * @property {string} text
 * @property {number} confidence
 * @property {Baseline} baseline
 * @property {Bbox} bbox
 * @property {boolean} is_ltr
 * @property {Block} block
 * @property {Page} page
 * @property {Word[]} words
 * @property {TessSymbol[]} symbols
 */

/**
 * @typedef {Object} Block
 * @property {Paragraph[]} paragraphs
 * @property {string} text
 * @property {number} confidence
 * @property {Baseline} baseline
 * @property {Bbox} bbox
 * @property {string} blocktype
 * @property {*} polygon
 * @property {Page} page
 * @property {Line[]} lines
 * @property {Word[]} words
 * @property {TessSymbol[]} symbols
 */

/**
 * @typedef {Object} Page
 * @property {Block[]|null} blocks
 * @property {number} confidence
 * @property {Line[]} lines
 * @property {string} oem
 * @property {string} osd
 * @property {Paragraph[]} paragraphs
 * @property {string} psm
 * @property {TessSymbol[]} symbols
 * @property {string} text
 * @property {string} version
 * @property {Word[]} words
 * @property {string|null} hocr
 * @property {string|null} tsv
 * @property {string|null} box
 * @property {string|null} unlv
 * @property {string|null} sd
 * @property {string|null} imageColor
 * @property {string|null} imageGrey
 * @property {string|null} imageBinary
 * @property {number|null} rotateRadians
 * @property {string|null} debug
 * @property {string|null} debugVis
 * @property {number[]|null} pdf
 */

export {};
