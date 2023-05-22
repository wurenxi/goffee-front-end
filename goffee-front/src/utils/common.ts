/* 判断某个字符串重复了几次 */
const calCount = {
  count: 0
}
const strRepeat = (str: string, substr: string, calCount: { count: number }) => {
  if (str.indexOf(substr) != -1) {
    console.log(str)
    calCount.count++
    strRepeat(str.substring(str.indexOf(substr) + substr.length), substr, calCount)
  }
}
export const strRepeatTimes = (str: string, substr: string) => {
  calCount.count = 0
  strRepeat(str, substr, calCount)
  return calCount.count
}
