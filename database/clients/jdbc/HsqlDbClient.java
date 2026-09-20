import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;

public final class HsqlDbClient {

    private HsqlDbClient() {
    }

    public static void main(String[] args) throws Exception {
        if (args.length == 0) {
            throw new IllegalArgumentException(
                "SQL query is required as the first argument."
            );
        }

        String query = args[0];

        String host = System.getenv().getOrDefault(
            "DB_HOST",
            "localhost"
        );

        String port = System.getenv().getOrDefault(
            "DB_PORT",
            "9001"
        );

        String database = System.getenv().getOrDefault(
            "DB_NAME",
            "parabank"
        );

        String user = System.getenv().getOrDefault(
            "DB_USER",
            "sa"
        );

        String password = System.getenv().getOrDefault(
            "DB_PASSWORD",
            ""
        );

        String jdbcUrl =
            "jdbc:hsqldb:hsql://"
            + host
            + ":"
            + port
            + "/"
            + database;

        try (Connection connection = DriverManager.getConnection(
                jdbcUrl,
                user,
                password
        );
             Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery(query)) {

            ResultSetMetaData metadata =
                resultSet.getMetaData();

            int columnCount =
                metadata.getColumnCount();

            System.out.println("DB_CONNECTION=SUCCESS");

            while (resultSet.next()) {
                StringBuilder row =
                    new StringBuilder();

                for (int column = 1;
                     column <= columnCount;
                     column++) {

                    if (column > 1) {
                        row.append(" | ");
                    }

                    row.append(
                        metadata.getColumnLabel(column)
                    );

                    row.append("=");

                    row.append(
                        resultSet.getString(column)
                    );
                }

                System.out.println(row);
            }
        }
    }
}