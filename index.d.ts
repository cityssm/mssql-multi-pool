import mssql from 'mssql';
export declare function connect(config: mssql.config): Promise<mssql.ConnectionPool>;
export declare function releaseAll(): Promise<void>;
export declare function getPoolCount(): number;
declare const _default: {
    connect: typeof connect;
    releaseAll: typeof releaseAll;
    getPoolCount: typeof getPoolCount;
};
export default _default;
export * as mssql from 'mssql';
export type { Bit, BigInt, Decimal, Float, Int, Money, Numeric, SmallInt, SmallMoney, Real, TinyInt, Char, NChar, Text, NText, VarChar, NVarChar, Xml, Time, Date, DateTime, DateTime2, DateTimeOffset, SmallDateTime, UniqueIdentifier, Variant, Binary, VarBinary, Image, UDT, Geography, Geometry, TYPES, ConnectionPool, Transaction, IColumnMetadata, IRecordSet, IResult, ISqlType, config } from 'mssql';
