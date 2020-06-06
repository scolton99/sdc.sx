const recalc_line_numbers = () => {
    if (window.innerWidth < 1000) {
        assign_line_numbers();
        return;
    }

    const term = document.getElementsByClassName("terminal")[0];
    const ht = Math.max(window.innerHeight, 675);
    const lns = (ht / document.querySelector("span.terminal-line").offsetHeight) + 3;
    console.info(`Height: ${ht}px`);
    console.info(`Needed: ${lns} lines`);

    const ext_prg_lines = document.querySelectorAll("div.terminal > span.terminal-line.auto");
    console.info(`Existing lines: ${ext_prg_lines.length}`);
    for (const line of ext_prg_lines) {
        line.parentElement.removeChild(line);
    }

    const rem_lines = document.querySelectorAll("div.terminal > span.terminal-line");
    console.info(`Remaining lines: ${rem_lines.length}`);
    for (let i = 0; i < (lns - rem_lines.length); ++i) {
        const ln = document.createElement("span");
        ln.classList.add("terminal-line");
        ln.classList.add("auto");
        term.appendChild(ln);
    }

    assign_line_numbers();
};

const assign_line_numbers = () => {
    const all_lines = document.querySelectorAll("div.terminal > span.terminal-line");
    for (let i = 0; i < all_lines.length; ++i) {
        all_lines[i].id = `ln-${i + 1}`;
    }
};

const text_enter = () => {
    if (window.innerWidth < 1000 || document.body.classList.contains("projects")) {
        return;
    }

    let cur_line = 0;
    let cur_pos = 0;
    const text = [];
    const lines_dom = document.querySelectorAll("div.terminal > span.terminal-line:not(.auto), div.terminal > span.terminal-line:not(.auto) *");
    lines_dom.forEach(x => {
        const nodes = Array.from(x.childNodes);
        const text_nodes = nodes.filter(y => y.nodeType === 3);
        const tc_raw = text_nodes.map(y => y.textContent).reduce((y, z) => y + z, "");
        const tc = tc_raw.replace(/\n/g, "");

        text.push(tc)
        text_nodes.forEach(x => x.parentNode.removeChild(x));
    });

    const iter = function() {
        if (cur_line >= text.length) {
            return;
        } else if (text[cur_line] === "") {
            ++cur_line;
        } else if (cur_pos >= text[cur_line].length) {
            ++cur_line;
            cur_pos = 0;
        } else {
            lines_dom[cur_line].textContent += text[cur_line][cur_pos++];
        }

        window.setTimeout(iter, Math.random() * 5 + 10);
    };

    iter();
};

const scroll = () => {
    let last_scroll_pos = window.scrollY;
    const scr_rect = document.querySelector("div.terminal > span.terminal-line").getBoundingClientRect();
    const {height: scroll_height} = scr_rect;
    let dta = 0;

    return function() {
        dta += window.scrollY - last_scroll_pos;

        if (dta > scroll_height) {
            const new_pos = last_scroll_pos + scroll_height;

            window.scrollTo(0, new_pos + (scroll_height - (new_pos % scroll_height)));
            dta = 0;
        } else if (dta < -1 * scroll_height) {
            const new_pos = last_scroll_pos - scroll_height;

            window.scrollTo(0, new_pos - (new_pos % scroll_height));
            dta = 0;
        } else {
            window.scrollTo(0, last_scroll_pos);
        }

        last_scroll_pos = window.scrollY;
    }
};

window.addEventListener("DOMContentLoaded", recalc_line_numbers);
window.addEventListener("resize", recalc_line_numbers);

window.addEventListener("DOMContentLoaded", text_enter);

window.addEventListener("DOMContentLoaded", () => {
    window.addEventListener("scroll", scroll());
});
