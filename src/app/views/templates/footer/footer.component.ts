import {  Component } from '@angular/core';
import { maxHeaderSize } from 'http';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  windowScrolled = true;
  windowScrolledtop = false;
  windowScrolledbuttom = true;

  ngOnInit() {
    window.addEventListener('scroll', () => {
      this.windowScrolled = window.pageYOffset >= 0;
      this.windowScrolledtop = window.pageYOffset >400;
      this.windowScrolledbuttom =window.pageYOffset < this.bodysize()-1200
     // console.log(this.windowScrolled ,window.pageYOffset)

    });
    
  }

bodysize(){
 let scrollHeight = Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
  );
//  console.log(scrollHeight)
  return scrollHeight
}
  scrollToTop(): void {
    window.scrollTo(0, 0);
  }
  scrollTobutton(): void {
    let scrollHeight = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
    );
    
     window.scrollTo(0, scrollHeight);
  }
}
