import { DigitalquizzPage } from './app.po';

describe('digitalquizz App', () => {
  let page: DigitalquizzPage;

  beforeEach(() => {
    page = new DigitalquizzPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
