const { MongoClient } = require('./lib/index.js');

async function testPipelineError() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    const db = client.db('test');
    const collection = db.collection('test');
    
    console.log('Testing pipeline error detection...');
    
    // This will trigger the pipeline error (40323) because the pipeline stage is malformed
    const result = await collection.aggregate([
      { $match: { field: 'value' } },
      { $invalidStage: {} } // This will cause the error
    ]).toArray();
    
    console.log('Result:', result);
  } catch (error) {
    console.log('Error caught:', error.message);
    console.log('Error code:', error.code);
  } finally {
    await client.close();
  }
}

testPipelineError().catch(console.error); 