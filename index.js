class Diff {
  constructor(type, path) {
    this.type = type;
    this.path = path;
  }
}

class DiffEdit extends Diff {
  constructor(path, lhs, rhs) {
    super('E', path);

    this.lhs = lhs;
    this.rhs = rhs;
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

export default (lhs, rhs, props = {}) => {
  const diffData = [];
  const mathKey = props.mathKey;

  const nestedDiffMatch = (lhData, rhData, currentPath, mathKey) => {
    lhData.forEach(lhItem => {
      const rhFoundItemIndex = rhData.findIndex(
        rhItem => rhItem[mathKey] === lhItem[mathKey]
      );

      if (rhFoundItemIndex > -1) {
        nestedDiff(
          lhItem,
          rhData[rhFoundItemIndex],
          getPath(currentPath, rhFoundItemIndex)
        );
      } else {
        diffData.push(new DiffDel(currentPath, lhItem));
      }
    });

    rhData.forEach((rhItem, key) => {
      const lhFoundItemIndex = lhData.findIndex(
        lhItem => rhItem[mathKey] === lhItem[mathKey]
      );

      if (lhFoundItemIndex === -1) {
        diffData.push(new DiffNew(getPath(currentPath, key), rhItem));
      }
    });
  };

  const nestedDiff = (lhData, rhData, currentPath) => {
    const typeOfLhData = Object.prototype.toString.call(lhData);
    const typeOfRhData = Object.prototype.toString.call(rhData);

    if (typeOfLhData !== typeOfRhData) {
      diffData.push(new DiffEdit(currentPath, lhData, rhData));
      return false;
    }

    if (typeOfLhData === '[object Object]') {
      Object.getOwnPropertyNames(lhData).forEach(key => {
        if (Object.prototype.hasOwnProperty.call(rhData, key)) {
          nestedDiff(lhData[key], rhData[key], getPath(currentPath, key));
        } else {
          diffData.push(new DiffDel(getPath(currentPath, key), lhData[key]));
        }
      });

      Object.getOwnPropertyNames(rhData).forEach(key => {
        if (!Object.prototype.hasOwnProperty.call(lhData, key)) {
          diffData.push(new DiffNew(getPath(currentPath, key), rhData[key]));
        }
      });
    } else if (typeOfLhData === '[object Array]') {
      if (!mathKey) {
        let lhDataLength = lhData.length - 1;
        let rhDataLength = rhData.length - 1;

        while (lhDataLength > rhDataLength) {
          diffData.push(
            new DiffDel(
              getPath(currentPath, lhDataLength),
              lhData[lhDataLength--]
            )
          );
        }
        while (rhDataLength > lhDataLength) {
          diffData.push(
            new DiffNew(
              getPath(currentPath, rhDataLength),
              rhData[rhDataLength--]
            )
          );
        }
        for (; lhDataLength >= 0; --lhDataLength) {
          nestedDiff(
            lhData[lhDataLength],
            rhData[lhDataLength],
            getPath(currentPath, lhDataLength)
          );
        }
      } else {
        nestedDiffMatch(lhData, rhData, currentPath, mathKey);
      }
    } else if (lhData !== rhData) {
      diffData.push(new DiffEdit(currentPath, lhData, rhData));
    }
  };

  nestedDiff(lhs, rhs);

  return diffData;
};
