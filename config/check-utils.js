// check if currentUser is_member and return true, else return false
exports.isMember = function (locals) {
  if (locals?.currentUser?.is_member === true) {
    return true;
  };
  return false;
};

// check if user is admin
exports.isAdmin = function (locals) {
  if (locals?.currentUser?.is_admin === true) {
    return true;
  };
  return false;
}

