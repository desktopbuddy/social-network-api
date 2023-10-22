const formatDate = (date) => {
  const day = date.getDate();
  const hour = date.getHours();
  const min = date. getMinutes();
  const month = date.getMonth();
  const year = date.getFullYear();
  return `${month}/${day}/${year}, ${hour}:${min}`;
}

module.exports = formatDate;