import msNodeSql from 'mssql/msnodesqlv8.js';
export declare function connect(config: msNodeSql.config): Promise<msNodeSql.ConnectionPool>;
export declare function releaseAll(): Promise<void>;
export declare function getPoolCount(): number;
declare const _default: {
    connect: typeof connect;
    releaseAll: typeof releaseAll;
    getPoolCount: typeof getPoolCount;
};
export default _default;
export * as mssql from 'mssql/msnodesqlv8.js';
export type { Bit, BigInt, Decimal, Float, Int, Money, Numeric, SmallInt, SmallMoney, Real, TinyInt, Char, NChar, Text, NText, VarChar, NVarChar, Xml, Time, Date, DateTime, DateTime2, DateTimeOffset, SmallDateTime, UniqueIdentifier, Variant, Binary, VarBinary, Image, UDT, Geography, Geometry, TYPES, ConnectionPool, Transaction, IColumnMetadata, IRecordSet, IResult, ISqlType, config } from 'mssql/msnodesqlv8.js';
