import fs from 'fs';

async function testAnalysis() {
  try {
    const imagePath = 'test_wound.jpg';
    if (!fs.existsSync(imagePath)) {
      console.error('Test image not found');
      process.exit(1);
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

    console.log('Sending request to /api/analyze-wound...');
    const response = await fetch('http://0.0.0.0:5000/api/analyze-wound', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageData: base64Image })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Analysis failed with status ${response.status}: ${errorText}`);
      process.exit(1);
    }

    const data = await response.json();
    console.log('Analysis successful!');
    console.log(JSON.stringify(data, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('Test script error:', error);
    process.exit(1);
  }
}

testAnalysis();
