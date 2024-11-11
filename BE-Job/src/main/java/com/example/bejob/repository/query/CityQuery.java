package com.example.bejob.repository.query;

import lombok.experimental.UtilityClass;

@UtilityClass
public class CityQuery {
    public final String QUERY = """
            SELECT * FROM city WHERE UNACCENT(name) ILIKE '%' || UNACCENT(?1) || '%'
            ORDER BY
              CASE
                WHEN name LIKE '%' || ?1 || '%' THEN 0
                WHEN name ILIKE '%' || ?1 || '%' THEN 1
                WHEN unaccent(name) ILIKE '%' || unaccent(?1) || '%' THEN 2
                ELSE 3
              END,
              name
            """;
}
