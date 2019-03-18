module.exports = {
  sleep: ms => new Promise(resolve => setTimeout(resolve, ms)),
  clear: () => process.stdout.write("\033c")
}