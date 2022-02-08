const TableName = {
  ADMIN: `${process.env.ProjectName}-admin-${process.env.StageName}`,
  COMPANY: `${process.env.ProjectName}-company-${process.env.StageName}`,
  COMPANY_USER: `${process.env.ProjectName}-user-${process.env.StageName}`,
  TEMP_FILE: `${process.env.ProjectName}-file-temp-${process.env.StageName}`,
  FILE_COMPANY: `${process.env.ProjectName}-file-%s-${process.env.StageName}`,
}

module.exports = { TableName };