const Peekaboo = {
  peekerId: 0,
  peekerHash: () => {
    return 'pab-' + Math.random().toString(36).substr(2) + Peekaboo.peekerId++;
  },
  createPeeker: info => {
    let peeker = document.createElement('div'),
        arrow = document.createElement('div'),
        content = document.createElement('div');

    peeker.classList.add('peekaboo-peeker');
    arrow.classList.add('peekaboo-arrow');
    content.classList.add('peekaboo-content');

    info = info || '';
    content.innerHTML = info;

    peeker.appendChild(arrow);
    peeker.appendChild(content);

    return peeker;
  },
  parse: parent => {
    parent = parent || document;

    new Array(...parent.getElementsByTagName('pab')).forEach(p => {
      let info = p.getAttribute('info') || "<strong>WARNING:</strong> Please define an <em>&quot;info&quot;</em> attribute.",
          peeker = document.getElementById(p.getAttribute('peeker-id')) || Peekaboo.createPeeker();

      let bodyRect = document.body.getBoundingClientRect(),
          elemRect = p.getBoundingClientRect(),
          position = { x: ((elemRect.left+elemRect.right)/2)-bodyRect.left, y: elemRect.bottom-bodyRect.top };

      peeker.style.left = `${position.x-95}px`;
      peeker.style.top = `${position.y+7.5}px`;

      peeker.children[1].innerHTML = info;
      p.style.cursor = 'help';

      p.onmouseenter = () => {
        window.clearTimeout(peeker.timeout);
        peeker.classList.remove('peekaboo-hidden');
        peeker.classList.add('peekaboo-shown');
        peeker.style.display = 'block';
      };
      p.onmouseleave = () => {
        peeker.classList.remove('peekaboo-shown');
        peeker.classList.add('peekaboo-hidden');
        peeker.timeout = window.setTimeout(() => {peeker.style.display='none';}, 500);
      };

      peeker.id = Peekaboo.peekerHash();
      p.setAttribute('peeker-id', peeker.id);

      document.body.appendChild(peeker);
    });
  },
  reposition: parent => {
    parent = parent || document;

    new Array(...parent.getElementsByTagName('pab')).forEach(p => {
      let peeker = document.getElementById(p.getAttribute('peeker-id'));

      let bodyRect = document.body.getBoundingClientRect(),
          elemRect = p.getBoundingClientRect(),
          position = { x: ((elemRect.left+elemRect.right)/2)-bodyRect.left, y: elemRect.bottom-bodyRect.top };

      peeker.style.left = `${position.x-95}px`;
      peeker.style.top = `${position.y+7.5}px`;
    });
  },
};
(() => {
  let style = document.createElement('style'),
      tags = `
        @keyframes peekaboo-make-visible {
          0%    { opacity: 0; }
          100%  { opacity: 1; }
        }
        @keyframes peekaboo-make-hidden {
          0%    { opacity: 1; }
          100%  { opacity: 0; }
        }

        .peekaboo-shown {
          animation: peekaboo-make-visible 0.5s ease 0s 1 forwards;
          opacity: 1;
        }

        .peekaboo-hidden {
          animation: peekaboo-make-hidden 0.5s ease 0s 1 forwards;
          opacity: 0;
        }

        .peekaboo-peeker {
          position: absolute;
          z-index: 10;
          display: none;
          padding: 0;
          width: 200px;
          height: auto;
        }

        .peekaboo-arrow {
          display: block;
          margin: 0 auto;
          width: 0;
          height: 0;
          border-bottom: 5px solid #DADADA;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
        }

        .peekaboo-content {
          display: block;
          padding: 7.5px;
          font-family: sans-serif;
          background-color: #DADADA;
          border-radius: 5px;
        }
      `;
  style.type = 'text/css';

  if (style.styleSheet) style.styleSheet.cssText = tags;
  else style.appendChild(document.createTextNode(tags));
  document.body.appendChild(style);
})();
