// convert an array in form [1,2,3] into a string "ABC" (easily sortable)
module.exports = function array_to_str(score) {
  var i, s = ''; // output string
  for (i = 0; i < score.length; i++) {
    s += String.fromCharCode(64 + score[i]);
  }
  return s;
};
