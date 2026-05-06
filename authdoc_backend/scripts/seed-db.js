import db from "../shared/db/postgres.js"

// Document schemas
const schemas = {
  marriage: {
    version: "1.0",
    language: "default",
    fields: [
      { field_name: "Form_Type", data_type: "string", required: true },
      { field_name: "Page_No", data_type: "number", required: false },
      { field_name: "Record_No", data_type: "string", required: false },
      { field_name: "Event_Day", data_type: "number", required: true },
      { field_name: "Event_Month", data_type: "string", required: true },
      { field_name: "Event_Year", data_type: "number", required: true },
      { field_name: "Event_Place_Municipality", data_type: "string", required: true },
      { field_name: "Event_Place_District", data_type: "string", required: false },
      { field_name: "Event_Place_Province", data_type: "string", required: false },
      { field_name: "Groom_Given", data_type: "string", required: true },
      { field_name: "Groom_Surname", data_type: "string", required: true },
      { field_name: "Groom_Residence", data_type: "string", required: false },
      { field_name: "Groom_Age", data_type: "string", required: false },
      { field_name: "Bride_Given", data_type: "string", required: true },
      { field_name: "Bride_Surname", data_type: "string", required: true },
      { field_name: "Bride_Residence", data_type: "string", required: false },
    ]
  },
  birth: {
    version: "1.0",
    language: "default",
    fields: [
      { field_name: "Form_Type", data_type: "string", required: true },
      { field_name: "Record_No", data_type: "string", required: false },
      { field_name: "Event_Day", data_type: "number", required: true },
      { field_name: "Event_Month", data_type: "string", required: true },
      { field_name: "Event_Year", data_type: "number", required: true },
      { field_name: "Child_Given", data_type: "string", required: true },
      { field_name: "Child_Surname", data_type: "string", required: true },
      { field_name: "Father_Given", data_type: "string", required: false },
      { field_name: "Father_Surname", data_type: "string", required: false },
      { field_name: "Mother_Given", data_type: "string", required: false },
      { field_name: "Mother_Surname", data_type: "string", required: false },
    ]
  },
  death: {
    version: "1.0",
    language: "default",
    fields: [
      { field_name: "Form_Type", data_type: "string", required: true },
      { field_name: "Record_No", data_type: "string", required: false },
      { field_name: "Event_Day", data_type: "number", required: true },
      { field_name: "Event_Month", data_type: "string", required: true },
      { field_name: "Event_Year", data_type: "number", required: true },
      { field_name: "Deceased_Given", data_type: "string", required: true },
      { field_name: "Deceased_Surname", data_type: "string", required: true },
      { field_name: "Deceased_Age", data_type: "string", required: false },
      { field_name: "Father_Given", data_type: "string", required: false },
      { field_name: "Father_Surname", data_type: "string", required: false },
      { field_name: "Mother_Given", data_type: "string", required: false },
      { field_name: "Mother_Surname", data_type: "string", required: false },
    ]
  }
}

async function seedSchemas() {
  try {
    console.log("Seeding database with schemas...")

    for (const [docType, schema] of Object.entries(schemas)) {
      console.log(`\nProcessing ${docType}...`)

      // Check if schema already exists
      const exists = await db.query(
        `SELECT schema_id FROM schema_definitions 
         WHERE document_type=$1 AND version=$2 AND language=$3`,
        [docType, schema.version, schema.language]
      )

      let schemaId
      if (exists.rows.length > 0) {
        schemaId = exists.rows[0].schema_id
        console.log(`   ✓ Schema already exists (ID: ${schemaId})`)
      } else {
        // Create schema definition
        const result = await db.query(
          `INSERT INTO schema_definitions (document_type, version, language, created_at)
           VALUES ($1, $2, $3, NOW())
           RETURNING schema_id`,
          [docType, schema.version, schema.language]
        )
        schemaId = result.rows[0].schema_id
        console.log(`   ✓ Created schema definition (ID: ${schemaId})`)
      }

      // Add fields
      for (const field of schema.fields) {
        const fieldExists = await db.query(
          `SELECT field_id FROM schema_fields 
           WHERE schema_id=$1 AND field_name=$2`,
          [schemaId, field.field_name]
        )

        if (fieldExists.rows.length === 0) {
          await db.query(
            `INSERT INTO schema_fields (schema_id, field_name, data_type, required, created_at)
             VALUES ($1, $2, $3, $4, NOW())`,
            [schemaId, field.field_name, field.data_type, field.required]
          )
          console.log(`   ✓ Added field: ${field.field_name}`)
        }
      }
    }

    console.log("\nSchema seeding completed successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding schemas:", error.message)
    process.exit(1)
  }
}

seedSchemas()
