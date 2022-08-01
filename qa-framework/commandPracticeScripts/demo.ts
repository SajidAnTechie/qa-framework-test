import { Builder, By, until } from 'selenium-webdriver';

// This file is used for testing minor features of any library. Not that important

async function example() {
  const driver = new Builder().forBrowser('chrome').build();
  await driver.get('http://localhost:5500/website/index.html');
  const xPath = '//*[@id="cars"]/option[3]';
  const element = driver.findElement(By.xpath(xPath));
  //await printOuterHtml(element);
  await element.click();

  await driver.close();
}

const timer = (ms: number | undefined) => new Promise(res => setTimeout(res, ms))

async function runMultiTarget() {
  const driver = new Builder().forBrowser('chrome').build();

  try {
  await driver.get('http://127.0.0.1:5500/frameworkTestWebsite/wait.html');

  const element = await driver.findElement(By.xpath(`//*[@data-dyn-target-name='data-dyn-checkbox']`)); 
  const [count, targetAttribute] = await Promise.all([element.getAttribute('data-dyn-count'), element.getAttribute('data-dyn-target-name')]); //xpath from previous locator

  for (let i = 1; i <= parseInt(count); i++) {
    await driver.findElement(By.xpath(`//*[@${targetAttribute}-${i}='${targetAttribute}-${i}']`)).click();
    await timer(1000);
  }

  } catch (err) {
    console.log(err);
  }finally{
    await driver.close();
  }
}

async function waitUntilElementVisibleExample() {
  const driver = new Builder().forBrowser('chrome').build();
  await driver.get('http://localhost:5500/website/wait.html');
  const xPath = '//*[@id="download-text"]';
  const element = By.xpath(xPath);
  await driver.wait(until.elementLocated(element));
  await driver.findElement(element);
  await driver.close();
}

//waitUntilElementVisibleExample();

// example();

runMultiTarget();
