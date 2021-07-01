import React from 'react';
import { WebView } from 'react-native';
import PropTypes from 'prop-types';

/**
 * @param {*} dataSource
 * [
 *  {
 *    label: '结果',
 *    data: [...]
 *  }
 * ]
 */
const JSONView = ({ dataSource = [], style = {} }) => {
  JSONView.propTypes = {
    dataSource: PropTypes.array.isRequired,
    style: PropTypes.object.isRequired,
  };
  const bodyStr = `${dataSource.map(item => {
    const copyData = JSON.parse(JSON.stringify(item.data));
    if (copyData.nativeStackIOS) {
      delete copyData.nativeStackIOS;
    }
    const str = JSON.stringify(copyData, null, 4);
    return `<pre>${item.label}: ${str.replace(/\n/g, '<br>').replace(/\s/g, '&nbsp')}</pre>`;
  })}`;
  const HTML = `
      <!DOCTYPE html>\n
      <html>
        <head>
          <title>Hello Static World</title>
          <meta http-equiv="content-type" content="text/html; charset=utf-8">
          <meta name="viewport" content="width=320, user-scalable=no">
          <style type="text/css">
            body {
              margin: 10;
              padding: 10;
              font: 62.5% arial, sans-serif;
              background: #ccc;
            }
          </style>
        </head>
        <body>
          ${bodyStr}
        </body>
      </html>
      `;
  return (
    <WebView
      style={[
        {
          backgroundColor: '#ccc',
          height: 200,
        },
        style,
      ]}
      source={{ html: HTML }}
      scalesPageToFit={true}
    />
  );
};

export default JSONView;
