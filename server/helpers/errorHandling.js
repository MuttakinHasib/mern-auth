const uniqueMessage = err => {
  let output;
  try {
    let fieldName = err.message.split('.$')[1];
    field = field.split('dub key')[0];
    field = field.substring(0, field.lastIndexOf('_'));
    req.flash('errors', [
      {
        message: `An account with this ${field} already exists`,
      },
    ]);

    output =
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + 'Already exists';
  } catch (err) {
    output = 'Already exists';
  }
  return output;
};

exports.errorHandler = err => {
  let msg = '';
  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        msg = uniqueMessage(err);
        break;

      default:
        msg = 'Something went wrong';
        break;
    }
  } else {
    for (let errorName in err.errors) {
      if (err.errors[errorName].message) {
        msg = err.errors[errorName].message;
      }
    }
  }
  return msg;
};
