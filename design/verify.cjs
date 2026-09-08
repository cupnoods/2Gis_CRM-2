const {chromium}=require('C:/Users/kirgi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path=require('path');
const {pathToFileURL}=require('url');
(async()=>{
 let browser;
 try{browser=await chromium.launch({headless:true});}catch{browser=await chromium.launch({headless:true,channel:'msedge'});}
 const page=await browser.newPage({viewport:{width:1500,height:1200},deviceScaleFactor:1});
 await page.goto(pathToFileURL(path.join(__dirname,'preview.html')).href);
 const ids=['catalogue','company','pipeline','mobile-catalogue','mobile-company'];
 for(const id of process.argv.includes('--navigation-only')?[]:ids){
  await page.locator(`nav button[data-screen="${id}"]`).click();
  await page.locator(`section#${id}`).screenshot({path:path.join(__dirname,`${id}.png`)});
 }
 await page.locator('nav button[data-screen="catalogue"]').click();
 await page.locator('#catalogue [data-screen="company"]').first().click();
 if(!await page.locator('#company').isVisible())throw Error('Company navigation failed');
 await page.locator('#company [role="button"][data-screen="pipeline"]').click();
 if(!await page.locator('#pipeline').isVisible())throw Error('Pipeline navigation failed');
 console.log('Rendered all 5 screens; directory -> company -> pipeline navigation passed.');
 await browser.close();
})().catch(e=>{console.error(e.message);process.exit(1)});
