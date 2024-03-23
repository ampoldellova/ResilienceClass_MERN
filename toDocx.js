const fs = require('fs');
const path = require('path');
const docx = require('docx');
const { Document, Packer, Paragraph, HeadingLevel, TextRun } = docx;

const projectFolderPath = './'; // Assuming the project folder is in the current directory