import fs from 'fs'
import path from 'path'
import React from 'react';
import ReactPDF, { Font, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const dictionary = fs.readFileSync(path.resolve(__dirname, 'dictionary.txt'), 'utf8')

const toChunkReducer = size => (acc, _, i, arr) => (i % size)
  ? acc
  : [...acc, arr.slice(i, i + size)];

const Quixote = () => {
  const data = dictionary.split('\n').map(s =>
    (s.split(" ").length - 1) == 1
      ? s.split(' ')
      : s.split(' - '))

  const pages = data
    .reduce(toChunkReducer(50), [])
    .reduce((acc, chunk) => {
      const piece = chunk.length !== 50
        ? chunk.concat(Array(50 - chunk.length).fill(['', '']))
        : chunk;

      return acc
        .concat(piece.map(x => x[0]))
        .concat(piece.map(x => x[1]));
    }, [])
    .reduce(toChunkReducer(5), [])
    .reduce(toChunkReducer(10), [])
    .map((page, pageN) => pageN % 2 ? page.map(row => row.reverse()) : page);

  return (
    <Document>
      {pages.map((page, pageN) => (
        <Page style={S.body} size="A3">
          {page.map((row, rowN) => (
            <View style={S.row}>
              {row.map((text, colN) => (
                <View style={{
                  ...S.cell,
                  borderLeft: colN && '1px solid #eee',
                  borderTop: rowN && '1px solid #eee',
                }}>
                  <Text style={{ ...S.text, color: (pageN % 2) ? 'gray' : 'black' }}>
                    {text}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </Page>
      ))}
    </Document>
  );
};

Font.register({
  family: 'OpenSans',
  src: 'https://raw.githubusercontent.com/googlefonts/opensans/main/fonts/ttf/OpenSans-Regular.ttf'
});

const S = StyleSheet.create({
  body: {
    padding: 0,
    margin: 0,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  cell: {
    width: '20vw',
    height: '10vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 10,
    width: '10vw',
    textAlign: 'center',
    fontFamily: 'OpenSans'
  },
});

ReactPDF.render(<Quixote />, `${__dirname}/print.pdf`);
