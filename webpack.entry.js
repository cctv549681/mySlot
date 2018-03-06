const path = require('path');
const root = path.join(__dirname, './', 'static/resources/');
const fs = require('fs');
const mapValues = require('lodash/mapValues');

const src = path.join(root, 'react-src/');
const pagePath = path.join(src, 'pages/');

// const entry = {
//   groupBuyCart: path.join(
//     root,
//     'react-src/pages/groupBuyCart/groupBuyCart.tsx'
//   ),
//   groupBuyList: path.join(
//     root,
//     'react-src/pages/groupBuyList/groupBuyList.tsx'
//   ),
//   groupBuyDetail: path.join(
//     root,
//     'react-src/pages/groupBuyDetail/groupBuyDetail.tsx'
//   ),
//   groupBuyOrder: path.join(
//     root,
//     'react-src/pages/groupBuyOrder/groupBuyOrder.tsx'
//   ),
//   groupBuyIndex: path.join(
//     root,
//     'react-src/pages/groupBuyIndex/groupBuyIndex.tsx'
//   ),
//   orderList: path.join(root, 'react-src/pages/orderList/orderList.tsx'),
// };
// module.exports = entry;

function createEntry() {
  const entry = {};

  fs
    .readdirSync(pagePath)
    .filter(file => {
      return fs.lstatSync(path.join(pagePath, file)).isDirectory();
    })
    .filter(file => {
      return fs.existsSync(path.join(pagePath, file, 'index.tsx'));
    })
    .forEach(file => {
      entry[file] = path.join(pagePath, `${file}/index.tsx`);
    });
  console.log(entry);
  return entry;
}

module.exports = createEntry;
