Array.prototype.chunk = function ( n ) {
    if ( !this.length ) {
        return [];
    }
    return [ this.slice( 0, n ) ].concat( this.slice(n).chunk(n) );
};

const Quixote = () => {
  const data = window.raw.split('\n').map(s =>
    (s.split(" ").length - 1) == 1
      ? s.split(' ')
      : s.split(' - '))

  const pages = data.chunk(50)
    .reduce((acc, chunk) => {
      const piece = chunk.length !== 50
        ? chunk.concat(Array(50 - chunk.length).fill(['', '']))
        : chunk;
    
      return acc
        .concat(piece.map(x => x[0]))
        .concat(piece.map(x => x[1]));
    }, [])
    .chunk(5)
    .chunk(10)
    .map((page, pageN) => pageN % 2 ? page.map(row => row.reverse()) : page);
  
  
  console.log(pages);

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

ReactPDF.render(<Quixote />);
