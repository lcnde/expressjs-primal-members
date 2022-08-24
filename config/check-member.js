// check if currentUser is_member and return true, else return false
module.exports = function (locals) {
  if (locals?.currentUser?.is_member === true) {
    return true;
  }
  return false;
};

