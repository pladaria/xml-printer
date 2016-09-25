import test from 'ava';
import XmlReader from 'xml-reader';
import xmlPrint, {escapeXmlText, escapeXmlAttribute} from '../src';

const xml =
    `<document>
        <title attr1="'" attr2 attr3=0>Test</title>
        <body>
            <self-closing/>
            <text>some text > here</text>
            <![CDATA[]]><!-- emits an empty text node -->
        </body>
    </document>`;

const ast = XmlReader.parseSync(xml);

test('default options', t => {
    const result = xmlPrint(ast);
    const expected =
        '<document>' +
            '<title attr1="&apos;" attr2="" attr3="0">Test</title>' +
            '<body><self-closing/><text><![CDATA[some text > here]]></text></body>' +
        '</document>';
    t.is(result, expected);
});

test('single quote for attribute values', t => {
    const result = xmlPrint(ast, {quote: "'"});
    const expected =
        '<document>' +
            "<title attr1='&apos;' attr2='' attr3='0'>Test</title>" +
            '<body><self-closing/><text><![CDATA[some text > here]]></text></body>' +
        '</document>';
    t.is(result, expected);
});

test('disable attribute values escaping', t => {
    const result = xmlPrint(ast, {escapeAttributes: false});
    const expected =
        '<document>' +
            '<title attr1="\'" attr2="" attr3="0">Test</title>' +
            '<body><self-closing/><text><![CDATA[some text > here]]></text></body>' +
        '</document>';
    t.is(result, expected);
});

test('disable text escaping', t => {
    const result = xmlPrint(ast, {escapeText: false, indentType: '  '});
    const expected =
        '<document>' +
            '<title attr1="&apos;" attr2="" attr3="0">Test</title>' +
            '<body><self-closing/><text>some text > here</text></body>' +
        '</document>';
    t.is(result, expected);
});

test('disable self-closing', t => {
    const result = xmlPrint(ast, {selfClose: false});
    const expected =
        '<document>' +
            '<title attr1="&apos;" attr2="" attr3="0">Test</title>' +
            '<body><self-closing></self-closing><text><![CDATA[some text > here]]></text></body>' +
        '</document>';
    t.is(result, expected);
});

test('README main example', t => {
    const ast = {
        name: 'greeting',
        type: 'element',
        attributes: {time: '2016-01-02'},
        children: [
            {
                name: '',
                type: 'text',
                value: 'Hello!',
                attributes: {},
                children: [],
            },
        ],
    };
    const result = xmlPrint(ast);
    const expected = '<greeting time="2016-01-02">Hello!</greeting>';
    t.is(result, expected);
});

test('README escapeXmlText example', t => {
    const expected = '<![CDATA[escape <this>]]>';
    const result = escapeXmlText('escape <this>');
    t.is(result, expected);
});

test('README escapeXmlAttribute example', t => {
    const expected = 'escape &quot;this&quot;';
    const result = escapeXmlAttribute('escape "this"');
    t.is(result, expected);
});
