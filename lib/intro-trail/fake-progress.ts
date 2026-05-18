import gsap from "gsap";

export class FakeProgress {
  DOM: { el: HTMLElement };
  progressVal = { value: 0 };

  constructor(DOM_el: HTMLElement) {
    this.DOM = { el: DOM_el };
  }

  onComplete(onProgressComplete: () => void) {
    return gsap
      .timeline()
      .to(this.progressVal, {
        duration: 1.5,
        ease: "steps(14)",
        value: 100,
        onUpdate: () => {
          this.DOM.el.innerHTML = `${Math.floor(this.progressVal.value)}%`;
        },
        onComplete: onProgressComplete,
      })
      .to(this.DOM.el, {
        duration: 0.7,
        ease: "power3.inOut",
        opacity: 0,
      });
  }
}
