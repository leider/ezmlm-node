'use strict';
var path = require('path');

module.exports = function (fullQualifiedHome, exec) {
  var
    headeradd = 'Sender: <<#l#>@<#h#>>\nPrecedence: bulk\nX-No-Archive: yes\nList-Post: <mailto:<#l#>@<#h#>>\n',
    headerremove = 'return-path\nreturn-receipt-to\ncontent-length\nprecedence\nx-confirm-reading-to\nx-pmrqc\nlist-subscribe\nlist-unsubscribe\nlist-help\nlist-post\nsender\n';

  function dirForName(name) {
    return path.join(fullQualifiedHome, 'ezmlm', name);
  }

  function pathToHeaderAddFile(name) {
    return path.join(dirForName(name), '/headeradd');
  }

  function pathToHeaderRemoveFile(name) {
    return path.join(dirForName(name), '/headerremove');
  }

  function replyToList(name, callback) {
    var
      headeraddWithReplyTo = headeradd + 'Reply-To: <<#l#>@<#h#>>\n',
      headerremoveWithReplyTo = headerremove + 'reply-to\n';
    exec.perform('echo "' + headeraddWithReplyTo + '" > ' + pathToHeaderAddFile(name), function (error) {
      if (error) { return callback(error); }
      exec.perform('echo "' + headerremoveWithReplyTo + '" > ' + pathToHeaderRemoveFile(name), callback);
    });
  }

  function replyToSender(name, callback) {
    exec.perform('echo "' + headeradd + '" > ' + pathToHeaderAddFile(name), function (error) {
      if (error) { return callback(error); }
      exec.perform('echo "' + headerremove + '" > ' + pathToHeaderRemoveFile(name), callback);
    });
  }

  return {
    replyToList: replyToList,
    replyToSender: replyToSender
  };
};
