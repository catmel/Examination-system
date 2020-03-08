export const isObjectEqual = (a, b) => {
  // 获取a、b的类型
  const classNameA = toString.call(a)
  const classNameB = toString.call(b)

  if (classNameA === "[object Object]" && classNameB === "[object Object]") {
    const propsA = Object.getOwnPropertyNames(a);
    const propsB = Object.getOwnPropertyNames(b);
    if (propsA.length !== propsB.length) {
      return false
    }
    for (let i = 0; i < propsA.length; i++) {
      const propName = propsA[i];
      if (a[propName] !== b[propName]) {
        return false
      }
    }
    return true
  }
}
