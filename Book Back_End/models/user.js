let User = (id, fname, lname, email, password, role) => {
  this.UserId = id;
  this.FirstName = fname;
  this.LastName = lname;
  this.Email = email;
  this.Password = password;
  this.Role = role;
};

module.exports = User;
