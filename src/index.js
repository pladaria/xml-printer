/*!
 * XmlPrinter
 * Copyright (c) 2016 Pedro Ladaria <pedro.ladaria@gmail.com>
 * https://github.com/pladaria/xml-printer
 * License: MIT
 */

/**
 * typedef {Object} XmlNode
 * @property {string} name - element name (empty for text nodes)
 * @property {string} type - node type ('element' or 'text')
 * @property {string} value - value of a text node
 * @property {XmlNode} parent - reference to parent node or null
 * @property {Object} attributes - map of attributes name => value
 * @property {XmlNode[]} children - array of children nodes
 */

/**
 * Returns true if x is truthy or 0
 * @param  {any} x
 * @return {boolean}
 */
const isSomething = x =>
    x || x === 0;

/**
 * Escapes XML text
 * https://en.wikipedia.org/wiki/CDATA
 * @param  {string} text
 * @return {string}
 */
export const escapeXmlText = (text) => {
    if (isSomething(text)) {
        const str = String(text);
        return (/[&<>]/).test(str)
            ? `<![CDATA[${str.replace(/]]>/, ']]]]><![CDATA[>')}]]>`
            : str;
    }
    return '';
};

/**
 * Escapes attribute value
 * @param  {string} attribute
 * @return {string}
 */
export const escapeXmlAttribute = attribute => String(attribute)
    .replace(/&/g, '&amp;')
    .replace(/'/g, '&apos;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/**
 * Serializes an attribute value
 * @param  {string} attributes
 * @return {string}
 */
const serializeAttrs = (attributes, escapeValue, quote) => {
    let result = '';
    for (const k in attributes) {
        const v = attributes[k];
        result += ` ${k}=${quote}${isSomething(v) ? (escapeValue ? escapeXmlAttribute(v) : v) : ''}${quote}`;
    }
    return result;
};

/**
 * @param  {XmlNode|XmlNode[]} ast
 * @return {string}
 */
const print = (ast, options = {}) => {
    const {
        escapeAttributes = true,
        escapeText = true,
        selfClose = true,
        quote = '"',
    } = options;
    if (Array.isArray(ast)) {
        return ast.map((ast) => print(ast, options)).join('');
    }
    if (ast.type === 'text') {
        return `${escapeText ? escapeXmlText(ast.value) : ast.value}`;
    }
    const attributes = serializeAttrs(ast.attributes, escapeAttributes, quote);
    return (ast.children.length || !selfClose)
        ? `<${ast.name}${attributes}>${print(ast.children, options)}</${ast.name}>`
        : `<${ast.name}${attributes}/>`;
};

export default print;
