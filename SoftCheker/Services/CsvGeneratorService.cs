using ClosedXML.Excel;
using SoftCheker.Server.Entities;

namespace SoftCheker.Server.Services
{
    public interface ICsvGeneratorService
    {
        Task<string> GenerateReportCsvAsync(
            IEnumerable<Soft> products,
            IEnumerable<Domain> domains,
            IEnumerable<Contract> contracts,
            IEnumerable<Cert> certificates);
    }

    public class CsvGeneratorService : ICsvGeneratorService
    {
        private readonly ILogger<CsvGeneratorService> _logger;

        public CsvGeneratorService(ILogger<CsvGeneratorService> logger)
        {
            _logger = logger;
        }

        public async Task<string> GenerateReportCsvAsync(
            IEnumerable<Soft> products,
            IEnumerable<Domain> domains,
            IEnumerable<Contract> contracts,
            IEnumerable<Cert> certificates)
        {
            try
            {
                var directoryPath = @"C:\Reports";
                var fileName = $"Report_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx";
                var outputPath = Path.Combine(directoryPath, fileName);

                _logger.LogInformation("Starting XLSX generation. Output path: {OutputPath}", outputPath);

                if (!Directory.Exists(directoryPath))
                {
                    _logger.LogInformation("Directory {DirectoryPath} does not exist. Creating it.", directoryPath);
                    Directory.CreateDirectory(directoryPath);
                }

                using (var workbook = new XLWorkbook())
                {
                    AddWorksheet(workbook, "Systemy", products, new[]
                    {
                        "Nazwa", "Opis", "Wersja bieżąca", "Data końca podstawowego wsparcia", "Data końca rozszerzonego wsparcia", "Następna wersja"
                    }, new[]
                    {
                        "Name", "Description", "CurrentVersion", "BasicSupport", "ExtendedSupport", "NextVersion"
                    });

                    AddWorksheet(workbook, "Domeny", domains, new[]
                    {
                        "Nazwa", "Opis", "Data wygaśnięcia"
                    }, new[]
                    {
                        "Name", "Description", "ExpiredDate"
                    });

                    AddWorksheet(workbook, "Kontrakty", contracts, new[]
                    {
                        "Numer kontraktu", "Opis", "Data rozpoczęcia", "Data zakończenia", "Data odnowienia", "Cena brutto"
                    }, new[]
                    {
                        "ContractNumber", "Description", "StartDate", "EndDate", "RenewDate", "GrossPrice"
                    });

                    AddWorksheet(workbook, "Certyfikaty", certificates, new[]
                    {
                        "Nazwa", "Opis", "Data wydania", "Data wygaśnięcia"
                    }, new[]
                    {
                        "Name", "Description", "IssuedDate", "ExpiredDate"
                    });

                    workbook.SaveAs(outputPath);
                }

                _logger.LogInformation("XLSX generation completed. File saved at {OutputPath}", outputPath);

                return outputPath;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while generating XLSX.");
                throw;
            }
        }

        private void AddWorksheet<T>(XLWorkbook workbook, string sheetName, IEnumerable<T> items, string[] headers, string[] propertyNames)
        {
            var worksheet = workbook.Worksheets.Add(sheetName);

            for (int i = 0; i < headers.Length; i++)
            {
                var cell = worksheet.Cell(1, i + 1);
                cell.Value = headers[i];
                cell.Style.Font.Bold = true;
            }

            var row = 2;
            foreach (var item in items)
            {
                for (int col = 0; col < propertyNames.Length; col++)
                {
                    var propertyName = propertyNames[col];
                    var property = item.GetType().GetProperty(propertyName);
                    if (property != null)
                    {
                        var value = property.GetValue(item);
                        if (property.PropertyType == typeof(DateTime))
                        {
                            worksheet.Cell(row, col + 1).Value = ((DateTime)value).ToString("yyyy-MM-dd");
                        }
                        else if (property.PropertyType == typeof(decimal))
                        {
                            worksheet.Cell(row, col + 1).Value = ((decimal)value).ToString("C");
                        }
                        else
                        {
                            worksheet.Cell(row, col + 1).Value = value != null ? Convert.ToString(value) : string.Empty;
                        }
                    }
                }
                row++;
            }

            worksheet.Columns().AdjustToContents();
        }
    }
}
