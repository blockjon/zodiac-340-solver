var customColumnOrder = null

Vue.directive("draggable", {
    //adapted from https://codepen.io/kminek/pen/pEdmoo
    inserted: function(el, binding, a) {
        Sortable.create(el, {
            draggable: ".draggable",
            onEnd: function(e) {
                /* vnode.context is the context vue instance: "This is not documented as it's not encouraged to manipulate the vm from directives in Vue 2.0 - instead, directives should be used for low-level DOM manipulation, and higher-level stuff should be solved with components instead. But you can do this if some usecase needs this. */
                // fixme: can this be reworked to use a component?
                // https://github.com/vuejs/vue/issues/4065
                // https://forum.vuejs.org/t/how-can-i-access-the-vm-from-a-custom-directive-in-2-0/2548/3
                // https://github.com/vuejs/vue/issues/2873 "directive interface change"
                // `binding.expression` should be the name of your array from vm.data
                // set the expression like v-draggable="items"
                var clonedItems = a.context[binding.expression].filter(function(item) {
                    return item;
                });
                clonedItems.splice(e.newIndex, 0, clonedItems.splice(e.oldIndex, 1)[0]);
                a.context[binding.expression] = [];
                Vue.nextTick(function() {
                    a.context[binding.expression] = clonedItems;
                });
                draggableFired(clonedItems)
            }
        });
    }
});

Vue.component("table-head", {
    template: `
    <th
        v-show="true"
        :class=\"{draggable: true}\"
    >
      {{column.name}}
    </th>`,
    props: ["column", "sort"]
});

Vue.component("cipher-row", {
    template: `
    <tr>
      <template v-for="column in columns">
        <td v-show="true">{{cipherrowdata[column.id]}}</td>
      </template>
    </tr>
`,
    props: ["cipherrowdata", "columns"]
});

var myColumns = []
for (i=0; i<17; i++) {
    myColumns.push(
        { name: i, id: "column"+i }
    )
}

var zodiacCipherText = `HER>pl^VPk|1LTG2d
Np+B(#O%DWY.<*Kf)
By:cM+UZGW()L#zHJ
Spp7^l8*V3pO++RK2
_9M+ztjd|5FP+&4k/
p8R^FlO-*dCkF>2D(
#5+Kq%;2UcXGV.zL|
(G2Jfj#O+_NYz+@L9
d<M+b+ZR2FBcyA64K
-zlUV+^J+Op7<FBy-
U+R/5tE|DYBpbTMKO
2<clRJ|*5T4M.+&BF
z69Sy#+N|5FBc(;8R
lGFN^f524b.cV4t++
yBX1*:49CE>VUZ5-+
|c.3zBK(Op^.fMqG2
RcT+L16C<+FlWB|)L
++)WCzWcPOSHT/()p
|FkdW<7tB_YOB*-Cc
>MDHNpkSzZO8A|K;+`;
var rows = []
var linesSplit = zodiacCipherText.split(/\n/);

// Loop over reach row
for (i=0; i<linesSplit.length; i++) {
    columns = []
    rows.push({
        id: 'row' + i,
        'column0': linesSplit[i][0],
        'column1': linesSplit[i][1],
        'column2': linesSplit[i][2],
        'column3': linesSplit[i][3],
        'column4': linesSplit[i][4],
        'column5': linesSplit[i][5],
        'column6': linesSplit[i][6],
        'column7': linesSplit[i][7],
        'column8': linesSplit[i][8],
        'column9': linesSplit[i][9],
        'column10': linesSplit[i][10],
        'column11': linesSplit[i][11],
        'column12': linesSplit[i][12],
        'column13': linesSplit[i][13],
        'column14': linesSplit[i][14],
        'column15': linesSplit[i][15],
        'column16': linesSplit[i][16]
    })
}


function getProp(obj, path) {
    var parts = path.split(".");
    while (parts.length) {
        obj = obj[parts.shift()];
    }
    return obj;
}

var keyStore = {
    state: {
        A: '',
        B: '',
        C: '',
        D: '',
        E: '',
        F: '',
        G: '',
        H: '',
        I: '',
        J: '',
        K: '',
        L: '',
        M: '',
        N: '',
        O: '',
        P: '',
        Q: '',
        R: '',
        S: '',
        T: '',
        U: '',
        V: '',
        W: '',
        X: '',
        Y: '',
        Z: '',
    },
    update (englishLetter, zodiacLetters) {
        zodiacLetters = scrub(zodiacLetters)
        this.state[englishLetter] = zodiacLetters
        // Loop over the other english letters
        Object.entries(this.state).forEach((entry) => {
            if (entry[0] != englishLetter) {
                for (i=0; i<zodiacLetters.split('').length; i++) {
                    if (entry[1].indexOf(zodiacLetters[i]) > -1) {
                        alert('Zodiac letter ' + zodiacLetters[i] + ' cannot be used for english ' + englishLetter + ' because its already listed for english letter ' + entry[0])
                        this.state[englishLetter] = this.state[englishLetter].replace(zodiacLetters[i], '')
                    }
                }
            }
        })
        updateSolutionBoard()
    },
    resolveEnglishCharacter(zodiacCharacter) {
        var englishCharacter = null
        Object.entries(this.state).forEach((entry) => {
            for (i=0; i<entry[1].split('').length; i++) {
                if (entry[1].indexOf(zodiacCharacter) > -1) {
                    englishCharacter = entry[0]
                }
            }
        })
        return englishCharacter
    }
}

var scrub = function(input) {
    let re = /[^#%&()*+./123456789:;<>@ABCDEFGHJKLMNOPRSTUVWXYZ^_bcdfjklpqtyz|-]/g;
    var str = input.replace(re, '')
    var uniql="";
    for (var x=0;x < str.length;x++)
    {

        if(uniql.indexOf(str.charAt(x))==-1)
        {
            uniql += str[x];

        }
    }
    return uniql;
}

Vue.component('letter-keys', {
    data: function() {
        return keyStore.state
    },
    template: `<div>
                   <div class="letterRow">
                       <div class="englishLetter">A:</div>
                       <input class="cipherText letterInput" v-model="A" />
                   </div>
                   <div class="letterRow">
                       <div class="englishLetter">B:</div>
                       <input class="cipherText letterInput" v-model="B" />
                   </div>
                   <div class="letterRow">
                       <div class="englishLetter">C:</div>
                       <input class="cipherText letterInput" v-model="C" />
                   </div>
                   <div class="letterRow">
                       <div class="englishLetter">D:</div>
                       <input class="cipherText letterInput" v-model="D" />
                   </div>
                   <div class="letterRow">
                       <div class="englishLetter">E:</div>
                       <input class="cipherText letterInput" v-model="E" />
                   </div>
                   <div class="letterRow">
                       <div class="englishLetter">F:</div>
                       <input class="cipherText letterInput" v-model="F" />
                   </div>
                   <div class="letterRow">
                       <div class="englishLetter">G:</div>
                       <input class="cipherText letterInput" v-model="G" />
                   </div>
                   <div class="letterRow">
                       <div class="englishLetter">H:</div>
                       <input class="cipherText letterInput" v-model="H" />
                   </div>
                   <div class="letterRow">
                       <div class="englishLetter">I:</div>
                       <input class="cipherText letterInput" v-model="I" />
                   </div>
                   <div class="letterRow">
                       <div class="englishLetter">J:</div>
                       <input class="cipherText letterInput" v-model="J" />
                   </div>
                   <div class="letterRow">
                       <div class="englishLetter">K:</div>
                       <input class="cipherText letterInput" v-model="K" />
                   </div>
                   <div class="letterRow">
                       <div class="englishLetter">L:</div>
                       <input class="cipherText letterInput" v-model="L" />
                   </div>
                   <div class="letterRow">
                       <div class="englishLetter">M:</div>
                       <input class="cipherText letterInput" v-model="M" />
                   </div>
                   <div class="letterRow">
                       <div class="englishLetter">N:</div>
                       <input class="cipherText letterInput" v-model="N" />
                   </div>
                   <div class="letterRow">
                       <div class="englishLetter">O:</div>
                       <input class="cipherText letterInput" v-model="O" />
                   </div>
                   <div class="letterRow">
                       <div class="englishLetter">P:</div>
                       <input class="cipherText letterInput" v-model="P" />
                   </div>
                   <div class="letterRow">
                       <div class="englishLetter">Q:</div>
                       <input class="cipherText letterInput" v-model="Q" />
                   </div>
                   <div class="letterRow">
                       <div class="englishLetter">R:</div>
                       <input class="cipherText letterInput" v-model="R" />
                   </div>
                   <div class="letterRow">
                       <div class="englishLetter">S:</div>
                       <input class="cipherText letterInput" v-model="S" />
                   </div>
                   <div class="letterRow">
                       <div class="englishLetter">T:</div>
                       <input class="cipherText letterInput" v-model="T" />
                   </div>
                   <div class="letterRow">
                       <div class="englishLetter">U:</div>
                       <input class="cipherText letterInput" v-model="U" />
                   </div>
                   <div class="letterRow">
                       <div class="englishLetter">V:</div>
                       <input class="cipherText letterInput" v-model="V" />
                   </div>
                   <div class="letterRow">
                       <div class="englishLetter">W:</div>
                       <input class="cipherText letterInput" v-model="W" />
                   </div>
                   <div class="letterRow">
                       <div class="englishLetter">X:</div>
                       <input class="cipherText letterInput" v-model="X" />
                   </div>
                   <div class="letterRow">
                       <div class="englishLetter">Y:</div>
                       <input class="cipherText letterInput" v-model="Y" />
                   </div>
                   <div class="letterRow">
                       <div class="englishLetter">Z:</div>
                       <input class="cipherText letterInput" v-model="Z" />
                   </div>
               </div>`,
    watch: {
        A(newVal) {
            keyStore.update('A', newVal)
        },
        B(newVal) {
            keyStore.update('B', newVal)
        },
        C(newVal) {
            keyStore.update('C', newVal)
        },
        D(newVal) {
            keyStore.update('D', newVal)
        },
        E(newVal) {
            keyStore.update('E', newVal)
        },
        F(newVal) {
            keyStore.update('F', newVal)
        },
        G(newVal) {
            keyStore.update('G', newVal)
        },
        H(newVal) {
            keyStore.update('H', newVal)
        },
        I(newVal) {
            keyStore.update('I', newVal)
        },
        J(newVal) {
            keyStore.update('J', newVal)
        },
        K(newVal) {
            keyStore.update('K', newVal)
        },
        L(newVal) {
            keyStore.update('L', newVal)
        },
        M(newVal) {
            keyStore.update('M', newVal)
        },
        N(newVal) {
            keyStore.update('N', newVal)
        },
        O(newVal) {
            keyStore.update('O', newVal)
        },
        P(newVal) {
            keyStore.update('P', newVal)
        },
        Q(newVal) {
            keyStore.update('Q', newVal)
        },
        R(newVal) {
            keyStore.update('R', newVal)
        },
        S(newVal) {
            keyStore.update('S', newVal)
        },
        T(newVal) {
            keyStore.update('T', newVal)
        },
        U(newVal) {
            keyStore.update('U', newVal)
        },
        V(newVal) {
            keyStore.update('V', newVal)
        },
        W(newVal) {
            keyStore.update('W', newVal)
        },
        X(newVal) {
            keyStore.update('X', newVal)
        },
        Y(newVal) {
            keyStore.update('Y', newVal)
        },
        Z(newVal) {
            keyStore.update('Z', newVal)
        },
    }
})
var initSolutionBoard = function() {
    var solutionlines = []
    for (i=0; i<20; i++) {
        columns = []
        for (j=0; j<17; j++) {
            columns.push({columnNumber: j, englishChar: ''})
        }
        solutionlines.push(columns)
    }
    return solutionlines
}

/**
 * Main vue app.
 */
var app = new Vue({
    el: "#app",
    data: {
        columns: myColumns,
        rows: rows,
        solutionlines: initSolutionBoard(),
        keyStore: keyStore
    },
    computed: {
        filteredData: function() {
            // https://vuejs.org/examples/grid-component.html
            return this.rows;
        }
    },
    methods: {
        cellHoverStart(event) {
            // Clear all highlighted from cipher table.
            var cipherTable = document.getElementById('cipherTable')
            var allTds = cipherTable.getElementsByTagName("td")
            for (var i=0; i<allTds.length; i++) {
                allTds[i].className="none";
            }
            // Clear all highlighted from solution table.
            var cipherTable = document.getElementById('solutionTable')
            var allTds = cipherTable.getElementsByTagName("td")
            for (var i=0; i<allTds.length; i++) {
                allTds[i].className="none";
            }

            if (event.target.tagName == 'TD') {
                // Highlight the cipher table
                var cipherTable = document.getElementById('cipherTable')
                var searchText = cipherTable.rows[event.target.parentElement.rowIndex].cells[event.target.cellIndex].innerText
                var tdCells = cipherTable.getElementsByTagName("td");
                for (var i = 0; i < tdCells.length; i++) {
                    if (tdCells[i].innerText == searchText) {
                        tdCells[i].className = 'ghostHilight'

                        // Also highlight the solution table.
                        solutionTable.rows[tdCells[i].parentElement.rowIndex].cells[tdCells[i].cellIndex].className='ghostHilight'
                    }
                }
            }
        },
        cellHoverEnd(event) {
            // Clear all highlighted from solution table.
            var cipherTable = document.getElementById('solutionTable')
            var allTds = cipherTable.getElementsByTagName("td")
            for (var i=0; i<allTds.length; i++) {
                allTds[i].className="none";
            }

            var cipherTable = document.getElementById('cipherTable')
            var allTds = cipherTable.getElementsByTagName("td")
            for (var i=0; i<allTds.length; i++) {
                allTds[i].className="none";
            }
        },
    }
});

var resolveEnglishChar = function(columnIndex, rowIndex) {
    if (customColumnOrder) {
        columnIndex = customColumnOrder[columnIndex].name
    }
    var zodiacCharacter = app.rows[rowIndex]['column' + columnIndex]
    var englishCharacter = keyStore.resolveEnglishCharacter(zodiacCharacter)
    var newEnglishVal = ''
    if (englishCharacter != null) {
        newEnglishVal = englishCharacter
    }
    return newEnglishVal
}

var updateSolutionBoard = function(initInstruction=null) {
    var solutionlines = []
    for (rowIndex=0; rowIndex<app.rows.length; rowIndex++) {
        columns = []
        for (var columnIndex=0; columnIndex<17; columnIndex++) {
            columns.push({columnNumber: columnIndex, englishChar: resolveEnglishChar(columnIndex, rowIndex)})
            // break
        }
        solutionlines.push(columns)
    }
    app.solutionlines = solutionlines
}

var draggableFired = function(clonedItems) {
    customColumnOrder = clonedItems
    updateSolutionBoard()
}
