create table
    LITEDRIVE_USER (
        id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        USERNAME VARCHAR2 (100) not null UNIQUE,
        PASSWORD VARCHAR2 (255) not null,
        CREATED_AT TIMESTAMP(6) default SYSTIMESTAMP not null,
        UPDATED_AT TIMESTAMP(6) default SYSTIMESTAMP not null
    );

create table
    LITEDRIVE_FOLDER (
        id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        OWNER_ID NUMBER not null constraint FK_LITEDRIVE_FOLDER_OWNER references LITEDRIVE_USER on delete cascade,
        PARENT_FOLDER_ID NUMBER constraint FK_LITEDRIVE_FOLDER_PARENT references LITEDRIVE_FOLDER on delete cascade,
        NAME VARCHAR2 (255) not null,
        CREATED_AT TIMESTAMP(6) default SYSTIMESTAMP not null,
        UPDATED_AT TIMESTAMP(6) default SYSTIMESTAMP not null
    );

create table
    LITEDRIVE_FILE (
        id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        OWNER_ID NUMBER not null constraint FK_LITEDRIVE_FILE_OWNER references LITEDRIVE_USER on delete cascade,
        FOLDER_ID NUMBER constraint FK_LITEDRIVE_FILE_FOLDER references LITEDRIVE_FOLDER on delete cascade,
        NAME VARCHAR2 (255) not null,
        MIME_TYPE VARCHAR2 (128),
        SIZE_BYTES NUMBER not null,
        CONTENT BLOB not null,
        CREATED_AT TIMESTAMP(6) default SYSTIMESTAMP not null,
        UPDATED_AT TIMESTAMP(6) default SYSTIMESTAMP not null,
        DELETED_AT TIMESTAMP(6),
        SHARE_CODE VARCHAR2 (64)
    );