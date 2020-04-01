export function disableShakeToUndo(node) {
  node.onkeypress = function(e) {
    e.preventDefault();
    let nationUnicode = e.which;
    let utf8 = encodeURIComponent(
      String.fromCharCode(parseInt(nationUnicode, 10))
    );

    //This isn't an emoji
    if (utf8.search("%EF") !== 0) {
      node.value = node.value + String.fromCharCode(nationUnicode);

      node.dispatchEvent(
        new CustomEvent("inputChanged", {
          detail: node.value
        })
      );
    }
  };

  node.onkeydown = function(e) {
    if (e.keyCode == 8) {
      e.preventDefault();
      const value = node.value;
      node.value = value.slice(0, value.length - 1);

      node.dispatchEvent(
        new CustomEvent("inputChanged", {
          detail: node.value
        })
      );
    }
  };
}
