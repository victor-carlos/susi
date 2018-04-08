from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine, Table


Base = declarative_base()
engine = create_engine('postgresql://user:pass@localhost:5432/database')

class Estabeleciomentos(Base):
    __table__ = Table("posts", Base.metadata,
                autoload=True, autoload_with=engine)
