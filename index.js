class Diff {
  constructor(type, path) {
    this.type = type;
    this.path = path ? path.toString() : '';
  }
}

class DiffEdit extends Diff {
  constructor(path, lhs, rhs) {
    super('E', path);

    this.lhs = lhs;
    this.rhs = rhs;
  }
}

class DiffMoved extends Diff {
  constructor(path, item, lhsIndex, rhsIndex) {
    super('M', path);

    this.item = item;
    this.lhsIndex = lhsIndex;
    this.rhsIndex = rhsIndex;
  }
}

class DiffDel extends Diff {
  constructor(path, lhs) {
    super('D', path);

    this.lhs = lhs;
  }
}

class DiffNew extends Diff {
  constructor(path, rhs) {
    super('A', path);

    this.rhs = rhs;
  }
}

const getPath = (currentPath, key) =>
  currentPath ? `${currentPath}.${key}` : key;

export const diff = (lhs, rhs, options = {}) => {
  const diffData = [];
  const matchKey = options.matchKey;
  const types = options.types || ['E', 'A', 'D', 'M'];

  const nestedDiffMatch = (lhData, rhData, currentPath, matchKey) => {
    lhData.forEach((lhItem, lhItemIndex) => {
      const rhFoundItemIndex = rhData.findIndex(
        rhItem => rhItem[matchKey] === lhItem[matchKey]
      );

      if (rhFoundItemIndex > -1) {
        if (types.indexOf('M') > -1 && lhItemIndex !== rhFoundItemIndex) {
          diffData.push(
            new DiffMoved(currentPath, lhItem, lhItemIndex, rhFoundItemIndex)
          );
        }

        nestedDiff(
          lhItem,
          rhData[rhFoundItemIndex],
          getPath(currentPath, rhFoundItemIndex)
        );
      } else if (types.indexOf('D') > -1) {
        diffData.push(new DiffDel(currentPath, lhItem));
      }
    });

    rhData.forEach((rhItem, key) => {
      const lhFoundItemIndex = lhData.findIndex(
        lhItem => rhItem[matchKey] === lhItem[matchKey]
      );

      if (types.indexOf('A') > -1 && lhFoundItemIndex === -1) {
        diffData.push(new DiffNew(getPath(currentPath, key), rhItem));
      }
    });
  };

  const nestedDiff = (lhData, rhData, currentPath) => {
    const typeOfLhData = Object.prototype.toString.call(lhData);
    const typeOfRhData = Object.prototype.toString.call(rhData);

    if (types.indexOf('E') > -1 && typeOfLhData !== typeOfRhData) {
      diffData.push(new DiffEdit(currentPath, lhData, rhData));
      return false;
    }

    if (typeOfLhData === '[object Object]') {
      Object.getOwnPropertyNames(lhData).forEach(key => {
        if (Object.prototype.hasOwnProperty.call(rhData, key)) {
          nestedDiff(lhData[key], rhData[key], getPath(currentPath, key));
        } else if (types.indexOf('D') > -1) {
          diffData.push(new DiffDel(getPath(currentPath, key), lhData[key]));
        }
      });

      Object.getOwnPropertyNames(rhData).forEach(key => {
        if (
          types.indexOf('A') > -1 &&
          !Object.prototype.hasOwnProperty.call(lhData, key)
        ) {
          diffData.push(new DiffNew(getPath(currentPath, key), rhData[key]));
        }
      });
    } else if (typeOfLhData === '[object Array]') {
      if (!matchKey) {
        let lhDataLength = lhData.length - 1;
        let rhDataLength = rhData.length - 1;

        if (types.indexOf('D') > -1) {
          while (lhDataLength > rhDataLength) {
            diffData.push(
              new DiffDel(
                getPath(currentPath, lhDataLength),
                lhData[lhDataLength--]
              )
            );
          }
        }

        if (types.indexOf('A') > -1) {
          while (rhDataLength > lhDataLength) {
            diffData.push(
              new DiffNew(
                getPath(currentPath, rhDataLength),
                rhData[rhDataLength--]
              )
            );
          }
        }

        for (; lhDataLength >= 0; --lhDataLength) {
          nestedDiff(
            lhData[lhDataLength],
            rhData[lhDataLength],
            getPath(currentPath, lhDataLength)
          );
        }
      } else {
        nestedDiffMatch(lhData, rhData, currentPath, matchKey);
      }
    } else if (types.indexOf('E') > -1 && lhData !== rhData) {
      diffData.push(new DiffEdit(currentPath, lhData, rhData));
    }
  };

  nestedDiff(lhs, rhs);

  return diffData;
};
