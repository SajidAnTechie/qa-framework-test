import { Builder, By, until } from 'selenium-webdriver';

async function example() {
  console.log('This is testing');
  const gridUrl = 'http://localhost:4444/wd/hub';
  
  const capabilities = {
    browserName: 'chrome',
    resolution: '1280x800',
    network: true,
    visual: true,
    console: true,
    video: true,
    name: 'Test 5', // name of the test
    build: 'NodeJS build', // name of the build
  };
  const driver = new Builder()
    .usingServer(gridUrl)
    .withCapabilities(capabilities)
    .build();
  try {
    console.log('inside try');
    await driver.get('https://www.lambdatest.com/');
    const title = await driver.getTitle();
    console.log(title);
    console.log('after driver.wai 4');

  }catch(err) {
      console.error('my error', err);
      await driver.close();
  }
  console.log('end');
  await driver.close();
  console.log('driver quit success');
}

function delay(ms: number): Promise<void> {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }

async function orch() {
    for(let i = 0; i < 5; i++) {
        example();
        await delay(1 * 1000);
    }
}
orch();
