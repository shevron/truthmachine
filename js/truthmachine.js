/**
 * Created by shahar on 10/27/13.
 */


/**
 * Map keyboard characters to logic symbols
 */
var symbolMap = {
    ".": "•",
    "*": "•",
    "&": "•",
    "v": "∨",
    "+": "∨",
    "|": "∨",
    ">": "⊃",
    "=": "≡",
    "!": "~"
};

$(document).ready(function()
{
    $("#main-go").click(function ()
    {
        $("#results").text('');
        var t = $("#main-input").val();
        try {
            var vm = new TruthMachine(t);
        } catch (ex) {
            $("#results").html('<div class="error-pre">Syntax Error: ' + ex + '</div>');
            return;
        }

        var table = vm.generateTable();
        if (table.length < 2) {
            $("#results").html('<div class="error-pre">Truth Table contains too few rows</div>');
        } else {
            renderTruthTable($("#results"), table);
        }
    });

    $("#main-input").keypress(function(ev)
    {
        var k = String.fromCharCode(ev.charCode);
        if (symbolMap.hasOwnProperty(k) && ! ev.metaKey) {
            $(this).insertAtCaret(symbolMap[k]);
        } else {
            return true;
        }
        return false;
    })
});

/**
 * Modified from http://stackoverflow.com/questions/946534/insert-text-into-textarea-with-jquery/946556#946556
 */
$.fn.extend({
    insertAtCaret: function(myValue) {
        var el = this[0];
        if (el.selectionStart || el.selectionStart == '0') {
            var startPos = el.selectionStart;
            var endPos = el.selectionEnd;
            var scrollTop = el.scrollTop;
            el.value = el.value.substring(0, startPos) + myValue + el.value.substring(endPos, el.value.length);
            el.focus();
            el.selectionStart = startPos + myValue.length;
            el.selectionEnd = startPos + myValue.length;
            el.scrollTop = scrollTop;
        } else {
            el.value += myValue;
            el.focus();
        }
    }
});

/**
 * Render results to an HTML table
 *
 * @param container
 * @param table
 */
function renderTruthTable(container, table)
{
    var tbl = $('<table id="results-table" class="truth-table"></table>');
    var cols = table[0].length;
    // Render header row
    var hdr = tbl.append($('<thead><tr></tr></thead>')).children().first();
    var header = table[0];
    for (var i = 0; i < cols; i++) {
        var th = $('<th></th>').text(table[0][i]);
        hdr.append(th);
    }

    // Render result rows
    var tbody = tbl.append('<tbody></tbody>');
    for (var i = 1; i < table.length; i++) {
        var tr = $('<tr></tr>');
        for (var j = 0; j < cols; j++) {
            var td = $('<td></td>').text(table[i][j] ? 'TRUE' : 'FALSE');
            tr.append(td);
        }
        tbody.append(tr);
    }

    container.html(tbl);
};

/**
 * The ThruthMachine "VM" constructor
 *
 * @constructor
 */
var TruthMachine = function(sentence) {
    this._tree = [];
    this._vars = [];
    this._sentence = null;

    if (sentence) {
        this.parse(sentence);
    }
};

/**
 * Parse source code, also resetting the variable table. This is called
 *
 * @param sentence
 */
TruthMachine.prototype.parse = function(sentence)
{
    // Invoke parser
    this._tree = sententialLogic.parse(sentence);

    // Build variables list
    this._vars = [];
    this._scan_vars(this._tree);

    // Save original sentence
    this._sentence = sentence;
};

/**
 * Recursive function to scan the opcode tree for variables
 *
 * @param tree
 * @private
 */
TruthMachine.prototype._scan_vars = function(tree)
{
    for(var i = 0; i < tree.length; i++) {
        if (Object.prototype.toString.call(tree[i]) === '[object Array]') {
            this._scan_vars(tree[i]);
        } else if(typeof tree[i] === 'string' && tree[i].length === 1) {
            if (this._vars.indexOf(tree[i]) === -1) {
                this._vars.push(tree[i]);
            }
        }
    }
};

/**
 * Generate a truth table for the parsed sentence
 *
 * @returns {Array}
 */
TruthMachine.prototype.generateTable = function()
{
    var bits = this._vars.length;
    if (bits == 0) return [];
    var values = {};

    // First line of the table is headers: var columns and a result column
    var result = [ this._vars ];
    result[0].push(this._sentence);

    // For 2^n rows
    for (var perms = Math.pow(2, bits) - 1; perms >= 0; perms--) {
        // Set values for each var
        var row = [];
        for (var i = 0; i < bits; i++) {
            var val = !! (perms & 1 << (bits - i - 1));
            values[this._vars[i]] = val;
            row.push(val);
        }
        // Compute result for row
        row.push(this.compute(values));
        result.push(row);
    }
    return result;
};

/**
 * Compute truth value for a set of variable values
 *
 * @returns {boolean}
 */
TruthMachine.prototype.compute = function(values)
{
    var node = this._tree;
    return this._run_tree(node, values);
};

TruthMachine.prototype._run_tree = function(node, values)
{
    var op    = node[0];
    var left  = node[1];
    var right = (node.length > 2 ? node[2] : null);

    if (Object.prototype.toString.call(left) === '[object Array]') {
        left = this._run_tree(left, values);
    } else if (typeof left === 'string') {
        left = values[left];
    }

    if (Object.prototype.toString.call(right) === '[object Array]') {
        right = this._run_tree(right, values);
    } else if (typeof right === 'string') {
        right = values[right];
    }

    /** Showtime **/
    switch (op) {
        case 'CON':
            return left && right;
        case 'DIS':
            return left || right;
        case 'IMP':
            return (! left) || (right && left);
        case 'EQV':
            return (left === right);
        case 'NEG':
            return ! left;
        default:
            throw "Unknown operator: '" + op + "'";
    }
};
