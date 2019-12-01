/**
 * Program to add VERY large numbers in javascript
 * Note - numbers should be passed as strings or numbers.
 * example -
 * add(15, "15");  // returns "30"
 * https://medium.com/@nitinpatel_20236/javascript-adding-extremely-large-numbers-and-extra-long-factorials-229b6055cb1a
 */
function add(num1, num2) {
  let str1 = String(num1);
  let str2= String(num2);

  let sum = "";  // our result will be stored in a string.

  // we'll need these in the program many times.
  let str1Length = str1.length;
  let str2Length = str2.length;

  // if s2 is longer than s1, swap them.
  if(str2Length > str1Length ){
    let temp = str2;
    str2 = str1;
    str1 = temp;
  }

  let carry = 0;  // number that is carried to next decimal place, initially zero.
  let a;
  let b;
  let temp;
  let digitSum;
  for (let i = 0; i < str1.length; i++) {
    a = parseInt(str1.charAt(str1.length - 1 - i));      // get ith digit of str1 from right, we store it in a
    b = parseInt(str2.charAt(str2.length - 1 - i));      // get ith digit of str2 from right, we store it in b
    b = (b) ? b : 0;                                    // make sure b is a number, (this is useful in case, str2 is shorter than str1
    temp = (carry + a + b).toString();                  // add a and b along with carry, store it in a temp string.
    digitSum = temp.charAt(temp.length - 1);            //
    carry = parseInt(temp.substr(0, temp.length - 1));  // split the string into carry and digitSum ( least significant digit of abSum.
    carry = (carry) ? carry : 0;                        // if carry is not number, make it zero.

    sum = (i === str1.length - 1) ? temp + sum : digitSum + sum;  // append digitSum to 'sum'. If we reach leftmost digit, append abSum which includes carry too.
  }

  return sum;     // return sum
}

exports.add = add;